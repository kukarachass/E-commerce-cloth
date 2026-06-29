"use server"

import { and, eq, inArray } from "drizzle-orm"
import { db } from "@/db"
import { order, orderItem, payment, productSize, returnItem, returnRequest } from "@/db/schema"
import { stripe } from "@/lib/stripe/stripe"
import { getServerSession } from "@/lib/get-session"
import isAdmin from "@/lib/auth/isAdmin";

type Decision = { returnItemId: string; decision: "approve" | "reject" }
type ProcessResult =
    | { ok: true; refundId: string | null }
    | { ok: false; error: "FORBIDDEN" | "NOT_FOUND" | "NO_PAYMENT" | "REFUND_FAILED" | "WRONG_STATUS" | "UNKNOWN" }

export async function processReturn(returnRequestId: string, decisions: Decision[]): Promise<ProcessResult> {
    // 1. только админ
    const session = await getServerSession()
    if (!session?.user.id || !(await isAdmin(session.user.id))) {
        return { ok: false, error: "FORBIDDEN" }
    }

    // 2. заявка + позиции + платёж заказа
    const req = await db.query.returnRequest.findFirst({
        where: eq(returnRequest.id, returnRequestId),
        with: { items: true },
    })
    if (!req) return { ok: false, error: "NOT_FOUND" }

    const decisionMap = new Map(decisions.map((d) => [d.returnItemId, d.decision]))

    // позиции, которые СЕЙЧАС одобряем — только из "requested"
    const toApprove = req.items.filter(
        (it) => decisionMap.get(it.id) === "approve" && it.status === "requested",
    )
    const toReject = req.items.filter(
        (it) => decisionMap.get(it.id) === "reject" && it.status === "requested",
    )
    if (toApprove.length === 0 && toReject.length === 0) {
        return { ok: false, error: "WRONG_STATUS" }
    }

    // 3. сумма рефанда = сумма одобренных позиций (в центах), считаем из снапшота цены
    const refundCents = toApprove.reduce(
        (sum, it) => sum + Math.round(Number(it.price) * 100) * it.quantity,
        0,
    )

    // 4. рефанд в Stripe (если есть что возвращать) — СНАРУЖИ транзакции
    let refundId: string | null = null
    if (refundCents > 0) {
        const pay = await db.query.payment.findFirst({ where: eq(payment.orderId, req.orderId) })
        if (!pay?.stripePaymentIntentId) return { ok: false, error: "NO_PAYMENT" }

        try {
            const refund = await stripe.refunds.create(
                { payment_intent: pay.stripePaymentIntentId, amount: refundCents },
                { idempotencyKey: `refund-${req.id}-${refundCents}` }, // защита от двойного возврата
            )
            refundId = refund.id
        } catch (e) {
            console.error("stripe refund failed", e)
            return { ok: false, error: "REFUND_FAILED" }
        }
    }

    // 5. транзакция: статусы позиций + сток + закрытие конверта + статус заказа
    try {
        await db.transaction(async (tx) => {
            // одобренные → refunded + поднять сток (ровно один раз)
            for (const it of toApprove) {
                if (!it.restocked) {
                    const [oi] = await tx.select().from(orderItem).where(eq(orderItem.id, it.orderItemId))
                    if (oi) {
                        const [ps] = await tx.select().from(productSize)
                            .where(eq(productSize.id, oi.productSizeId)).for("update")
                        if (ps) {
                            await tx.update(productSize)
                                .set({ stockAmount: ps.stockAmount + it.quantity })
                                .where(eq(productSize.id, ps.id))
                        }
                    }
                }
                await tx.update(returnItem)
                    .set({ status: "refunded", restocked: true })
                    .where(eq(returnItem.id, it.id))
            }

            // отклонённые → rejected
            if (toReject.length > 0) {
                await tx.update(returnItem)
                    .set({ status: "rejected" })
                    .where(inArray(returnItem.id, toReject.map((it) => it.id)))
            }

            // фиксируем рефанд на конверте
            if (refundId) {
                await tx.update(returnRequest)
                    .set({
                        stripeRefundId: refundId,
                        refundedAmount: req.refundedAmount + refundCents,
                    })
                    .where(eq(returnRequest.id, req.id))
            }

            // если активных позиций в заявке не осталось → закрываем конверт
            const stillActive = await tx.query.returnItem.findMany({
                where: and(
                    eq(returnItem.returnRequestId, req.id),
                    inArray(returnItem.status, ["requested", "approved"]),
                ),
            })
            if (stillActive.length === 0) {
                await tx.update(returnRequest).set({ status: "closed" }).where(eq(returnRequest.id, req.id))
            }

            // статус ЗАКАЗА: returned только если ВСЕ позиции заказа полностью возвращены
            await maybeMarkOrderReturned(tx, req.orderId)
        })

        return { ok: true, refundId }
    } catch (e) {
        // деньги уже ушли (если refundId != null), а БД упала — громкий лог для ручного разбора
        console.error("CRITICAL: refund ok but DB failed", { returnId: req.id, refundId }, e)
        return { ok: false, error: "REFUND_FAILED" }
    }
}

// заказ → returned, если по каждой его позиции возвращено = куплено
async function maybeMarkOrderReturned(tx: any, orderId: string) {
    const items = await tx.query.orderItem.findMany({
        where: eq(orderItem.orderId, orderId),
        with: { returnItems: true },
    })
    const allReturned = items.every((oi: any) => {
        const refunded = oi.returnItems
            .filter((ri: any) => ri.status === "refunded")
            .reduce((s: number, ri: any) => s + ri.quantity, 0)
        return refunded >= oi.quantity
    })
    if (allReturned) {
        await tx.update(order).set({ fulfillmentStatus: "returned" }).where(eq(order.id, orderId))
    }
}