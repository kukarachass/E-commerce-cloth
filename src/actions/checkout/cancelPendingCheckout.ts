"use server"

import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { order, payment } from "@/db/schema"
import { stripe } from "@/lib/stripe/stripe"
import { releaseStock } from "@/actions/checkout/releaseStock"

type CancelResult = { ok: true } | { ok: false; reason: "NOT_PENDING" | "NO_SESSION" }

export async function cancelPendingCheckout(orderId: string): Promise<CancelResult> {
    // 1. Отменяем ТОЛЬКО pending-заказ. paid/expired/refunded трогать нельзя.
    const [ord] = await db
        .select({ paymentStatus: order.paymentStatus })
        .from(order)
        .where(eq(order.id, orderId))

    if (!ord || ord.paymentStatus !== "pending") return { ok: false, reason: "NOT_PENDING" }

    // 2. Берём актуальную сессию (последнюю — на случай ретраев оплаты).
    const [pay] = await db
        .select({ sessionId: payment.stripeCheckoutSessionId })
        .from(payment)
        .where(eq(payment.orderId, orderId))
        .orderBy(desc(payment.createdAt))
        .limit(1)

    if (!pay?.sessionId) return { ok: false, reason: "NO_SESSION" }

    // 3. Гасим сессию в Stripe.
    try {
        await stripe.checkout.sessions.expire(pay.sessionId)

        // expire() прошёл успешно ⇒ сессия была "open" ⇒ точно не оплачена ⇒
        // можно сразу вернуть сток, не дожидаясь вебхука.
        await releaseStock(orderId, "expired")
    } catch (e) {
        // expire() падает, только если сессия уже "complete" (юзер успел оплатить
        // в гонке) или "expired". В обоих случаях сток сами НЕ трогаем:
        //  - complete → дойдёт checkout.session.completed и поставит paid;
        //  - expired  → checkout.session.expired сам вернёт сток.
        console.error("cancelPendingCheckout: expire failed (safe to ignore)", e)
    }

    return { ok: true }
}