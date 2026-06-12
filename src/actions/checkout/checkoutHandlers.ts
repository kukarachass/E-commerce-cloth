import Stripe from "stripe";
import {order, payment} from "@/db/schema";
import {eq} from "drizzle-orm";
import {releaseStockTx} from "@/actions/checkout/releaseStock";
import {DbTx} from "@/types/IDb";
import {stockAmountUpdate} from "@/actions/checkout/stockAmountUpdate";

export async function handleCheckoutCompleted(tx: DbTx, session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId
    if (!orderId) throw new Error("No orderId in metadata")

    const [ord] = await tx.select().from(order).where(eq(order.id, orderId)).for("update")
    if (!ord) throw new Error(`Order ${orderId} not found`)
    if (ord.paymentStatus !== "pending") return

    await tx.update(order).set({ paymentStatus: "paid" }).where(eq(order.id, orderId))
    await tx.update(payment)
        .set({ status: "succeeded", stripePaymentIntentId:
                typeof session.payment_intent === "string" ? session.payment_intent : null })
        .where(eq(payment.stripeCheckoutSessionId, session.id))

    await stockAmountUpdate({ tx, orderId })
}

export async function handleCheckoutExpired(tx: DbTx, session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId
    if (!orderId) return
    await releaseStockTx(tx, orderId, "expired")    // используем tx-версию  // ← наша функция из прошлого блока!
}

export async function handlePaymentFailed(tx: DbTx, pi: Stripe.PaymentIntent) {
    // Шаг 1 — достаём orderId из бирки
    const orderId = pi.metadata?.orderId
    if (!orderId) return

    // Шаг 2 — достаём причину провала (для журнала и поддержки)
    const reason = pi.last_payment_error?.message ?? "Unknown payment error"

    // Шаг 3 — помечаем платёж проваленным и сохраняем pi_... и причину.
    // ВАЖНО: заказ НЕ трогаем и сток НЕ возвращаем (объясню ниже).
    await tx.update(payment)
        .set({status: "failed", failureReason: reason, stripePaymentIntentId: pi.id})
        .where(eq(payment.orderId, orderId))
}

export async function handleChargeRefunded(tx: DbTx, charge: Stripe.Charge) {
    // Шаг 1 — находим, к какой попытке оплаты относится возврат (по pi_...)
    const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : null
    if (!piId) return;

    // Шаг 2 — блокируем строку платежа (FOR UPDATE) — защита от гонок при двойном вебхуке
    const [pay] = await tx.select().from(payment)
        .where(eq(payment.stripePaymentIntentId, piId))
        .for("update")
    if (!pay) throw new Error("Payment not found");


    // Шаг 3 — полный возврат или частичный?
    // charge.amount — сколько было списано; amount_refunded — сколько вернули (в центах).
    const fullyRefund = charge.amount_refunded >= charge.amount
    const newStatus = fullyRefund ? "refunded" : "partially_refunded";

    // Шаг 4 — обновляем платёж: статус, сумму возврата, id списания
    await tx.update(payment)
        .set({
            status: newStatus,
            refundedAmount: charge.amount_refunded,
            stripeChargeId: charge.id,
        })
        .where(eq(payment.id, pay.id))

    // Шаг 5 — синхронизируем статус заказа
    await tx.update(order)
        .set({paymentStatus: newStatus})
        .where(eq(order.id, pay.orderId))

    // Шаг 6 (важное решение): сток автоматически НЕ возвращаем.
    // Возврат денег ≠ возврат товара. Товар вернётся на склад, когда физически
    // приедет и пройдёт проверку — это отдельный процесс приёмки возврата.
}