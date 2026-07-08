"use server"

import {getServerSession} from "@/lib/get-session";
import {db} from "@/db";
import {stripe} from "@/lib/stripe/stripe";
import {order, orderItem, productSize, returnItem, returnRequest} from "@/db/schema";
import {and, eq} from "drizzle-orm";

interface cancelPaidOrderProps {
    orderId: string
}

type CancelResult =
    | { success: true }
    | { success: false; error: "FORBIDDEN" | "ORDER_ID_REQUIRED" | "NOT_ELIGIBLE" | "PAYMENT_NOT_FOUND" | "REFUND_FAILED" | "UNKNOWN" }

export async function cancelPaidOrder({ orderId }: cancelPaidOrderProps): Promise<CancelResult> {
    if (!orderId) return {error: "ORDER_ID_REQUIRED", success: false};
    const session = await getServerSession()
    if (!session?.user.id) return {success: false, error: "FORBIDDEN"}

    const result = await db.transaction(async (tx) => {
        const [ord] = await tx
            .select()
            .from(order)
            .where(
                and(
                    eq(order.userId, session.user.id),
                    eq(order.id, orderId),
                    eq(order.paymentStatus, "paid"),
                    eq(order.fulfillmentStatus, "unfulfilled")
                )
            )
            .for("update")

        if (!ord) return { success: false as const, error: "NOT_ELIGIBLE" as const }

        const userPayment = await tx.query.payment.findFirst({
            where: (payment, {eq}) => eq(payment.orderId, ord.id)
        })

        if (!userPayment) return { success: false as const, error: "PAYMENT_NOT_FOUND" as const }
        return { success: true as const, userPayment, ord }

    })

    if (!result.success) return result  // ← пробрасываем реальную ошибку, не подменяем
    const { userPayment, ord } = result
    if (!userPayment.stripePaymentIntentId) return { success: false, error: "PAYMENT_NOT_FOUND" }

    let stripeRefundId: string | null;
    try {
        const result = await stripe.refunds.create({
            payment_intent: userPayment.stripePaymentIntentId,
            amount: userPayment.amount,
            reason: "requested_by_customer"

        }, {idempotencyKey: `cancel-refund-${orderId}`})
        stripeRefundId = result.id

    } catch (err) {
        console.error(err)
        stripeRefundId = null
        return {error: "REFUND_FAILED", success: false};
    }



    try{
        await db.transaction(async (tx) => {
            const [fresh] = await tx.select().from(order).where(eq(order.id, ord.id)).for("update")
            if (!fresh || fresh.paymentStatus !== "paid") return

            await tx.update(order)
                .set({paymentStatus: "refunded", fulfillmentStatus: "cancelled"})
                .where(eq(order.id, fresh.id))

            const [request] = await tx.insert(returnRequest)
                .values({
                    orderId: fresh.id,
                    userId: session.user.id,
                    status: "closed",
                    stripeRefundId: stripeRefundId,
                    refundedAmount: userPayment.amount,
                    currency: userPayment.currency,
                })
                .returning({ id: returnRequest.id })

            const orderItems = await tx.select().from(orderItem).where(eq(orderItem.orderId, fresh.id))

            for (const it of orderItems) {

                const [ps] = await tx.select().from(productSize)
                    .where(eq(productSize.id, it.productSizeId))   // productSizeId прямо на orderItem
                    .for("update")
                if (!ps) throw new Error(`ProductSize not found for orderItem ${it.id}`)

                await tx.update(productSize)
                    .set({stockAmount: ps.stockAmount + it.quantity})
                    .where(eq(productSize.id, ps.id))

                await tx.insert(returnItem)
                    .values({
                        returnRequestId: request.id,
                        orderItemId: it.id,
                        status: "refunded",
                        quantity: it.quantity,
                        reason: "changed_mind",
                        price: it.price,
                        restocked: true
                    })
            }
        })
    }catch(err){
        console.error("CRITICAL: refund succeeded but DB update failed", {
            orderId, stripeRefundId, err,
        })
        return { success: false, error: "UNKNOWN" }
    }

    return {success: true}
}
