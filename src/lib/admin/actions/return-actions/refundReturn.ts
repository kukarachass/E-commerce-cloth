"use server"

import {requireAdmin} from "@/lib/admin/rbac";
import {db} from "@/db";
import {eq, sql} from "drizzle-orm";
import {payment, returnItem, returnRequest} from "@/db/schema";
import {refundableCents} from "@/lib/admin/returns/rules";
import Stripe from "stripe";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";
import {ReturnActionState} from "@/types/returns";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function refundReturn(
    requestId: string,
): Promise<ReturnActionState> {
    const { session } = await requireAdmin();

    // Шаг 1: собираем данные и проверяем — БЕЗ обращения к Stripe
    const req = await db.query.returnRequest.findFirst({
        where: eq(returnRequest.id, requestId),
        with: {
            items: true,
            order: { with: { payments: true } },
        },
    });

    if (!req) return { ok: false, message: "Заявка не найдена" };
    if (req.stripeRefundId) {
        return { ok: false, message: "Возврат по этой заявке уже сделан" };
    }

    const approved = req.items.filter((i) => i.status === "approved");
    if (approved.length === 0) {
        return { ok: false, message: "Нет одобренных позиций" };
    }

    const notRestocked = approved.filter((i) => !i.restocked);
    if (notRestocked.length > 0) {
        return {
            ok: false,
            message: `Сначала примите товар на склад (${notRestocked.length} поз.)`,
        };
    }

    const pay = req.order?.payments.find(
        (p) => p.status === "succeeded" && p.stripePaymentIntentId,
    );
    if (!pay?.stripePaymentIntentId) {
        return { ok: false, message: "Не найден успешный платёж по заказу" };
    }

    const amount = refundableCents(
        approved.map((i) => ({
            status: i.status,
            price: i.price,
            quantity: i.quantity,
        })),
    );

    const available = pay.amount - pay.refundedAmount;
    if (amount > available) {
        return {
            ok: false,
            message: `К возврату €${(amount / 100).toFixed(2)}, доступно €${(available / 100).toFixed(2)}`,
        };
    }

    // Шаг 2: вызов Stripe — ВНЕ транзакции
    let refund: Stripe.Refund;
    try {
        refund = await stripe.refunds.create(
            {
                payment_intent: pay.stripePaymentIntentId,
                amount,
                metadata: { returnRequestId: requestId },
            },
            // Ключ идемпотентности: повторный вызов не создаст второй возврат
            { idempotencyKey: `return_${requestId}` },
        );
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Ошибка Stripe";
        return { ok: false, message: `Stripe: ${msg}` };
    }

    // Шаг 3: фиксируем результат в БД
    await db.transaction(async (tx) => {
        await tx
            .update(returnItem)
            .set({ status: "refunded" })
            .where(eq(returnItem.returnRequestId, requestId));

        await tx
            .update(returnRequest)
            .set({
                stripeRefundId: refund.id,
                refundedAmount: amount,
                status: "closed",
            })
            .where(eq(returnRequest.id, requestId));

        await tx
            .update(payment)
            .set({
                refundedAmount: sql`${payment.refundedAmount} + ${amount}`,
                status:
                    pay.refundedAmount + amount >= pay.amount
                        ? "refunded"
                        : "partially_refunded",
            })
            .where(eq(payment.id, pay.id));

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "update",
            entityType: "return_request",
            entityId: requestId,
            after: { refundId: refund.id, amount },
        });
    });

    revalidatePath(`/admin/returns/${requestId}`);
    revalidatePath("/admin/returns");
    return { ok: true, message: `Возвращено €${(amount / 100).toFixed(2)}` };
}