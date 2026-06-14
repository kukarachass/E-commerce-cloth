"use server"

import { eq } from "drizzle-orm"
import { db } from "@/db"
import { order, payment } from "@/db/schema"
import { stripe } from "@/lib/stripe/stripe"

type ResumeResult =
    | { ok: true; url: string }
    | { ok: false; reason: "NOT_PENDING" | "SESSION_GONE" }

export async function resumeCheckout(orderId: string): Promise<ResumeResult> {
    const [ord] = await db.select({ paymentStatus: order.paymentStatus })
        .from(order).where(eq(order.id, orderId))
    if (!ord || ord.paymentStatus !== "pending") return { ok: false, reason: "NOT_PENDING" }

    const [pay] = await db.select({ sessionId: payment.stripeCheckoutSessionId })
        .from(payment).where(eq(payment.orderId, orderId))
    if (!pay?.sessionId) return { ok: false, reason: "SESSION_GONE" }

    const session = await stripe.checkout.sessions.retrieve(pay.sessionId)

    // открытая сессия ещё жива — отдаём ту же ссылку, резерв НЕ трогаем
    if (session.status === "open" && session.url) return { ok: true, url: session.url }

    // expired/complete: резерв уже ушёл (или оплачено) → пусть оформляет заново
    return { ok: false, reason: "SESSION_GONE" }
}