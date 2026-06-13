"use server"

import { eq } from "drizzle-orm"
import { db } from "@/db"
import { order, payment } from "@/db/schema"
import { stripe } from "@/lib/stripe/stripe"
// быстрый возврат стока при отмене

export async function cancelPendingCheckout(orderId: string) {
    // только если заказ ещё pending — оплаченную сессию гасить нельзя
    const [ord] = await db.select({ paymentStatus: order.paymentStatus })
        .from(order).where(eq(order.id, orderId))
    if (!ord || ord.paymentStatus !== "pending") return

    const [pay] = await db.select({ sessionId: payment.stripeCheckoutSessionId })
        .from(payment).where(eq(payment.orderId, orderId))
    if (!pay?.sessionId) return

    try {
        await stripe.checkout.sessions.expire(pay.sessionId)
        // дальше прилетит checkout.session.expired → releaseStock вернёт сток
    } catch (e) {
        console.error("cancelPendingCheckout: expire failed", e)
        // не страшно — сессия всё равно истечёт по expires_at
    }
}