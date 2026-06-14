"use server"

import { asc, eq, inArray } from "drizzle-orm"
import Stripe from "stripe"
import { db } from "@/db"
import { cartItem, order, orderItem, payment, productSize } from "@/db/schema"
import { stripe } from "@/lib/stripe/stripe"
import { releaseStock } from "@/actions/checkout/releaseStock"
import { getServerSession } from "@/lib/get-session"
import { resolveCurrentCart } from "@/actions/checkout/resolveCurrentCart"
import type { AddressSnapshot } from "@/types/IOrder"

type CheckoutInput = {
    email?: string // нужен ТОЛЬКО гостю; у залогиненного берём из сессии
    address: AddressSnapshot
}

type CheckoutResult =
    | { ok: true; url: string }
    | { ok: false; error: "CART_EMPTY" | "OUT_OF_STOCK" | "EMAIL_REQUIRED" | "UNKNOWN" }

// Stripe минимум для expires_at — 30 минут. Меньше нельзя.
const CHECKOUT_SESSION_TTL_SECONDS = 30 * 60

export async function createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    // 1. личность — только с сервера, клиенту не верим
    const session = await getServerSession()
    const userId = session?.user.id ?? null
    const email = userId ? session!.user.email : input.email
    if (!email) return { ok: false, error: "EMAIL_REQUIRED" }

    // 2. корзина — резолвим на сервере (не принимаем cartId от клиента)
    const cartId = await resolveCurrentCart(userId)
    if (!cartId) return { ok: false, error: "CART_EMPTY" }

    // 3. ТРАНЗАКЦИЯ: резерв стока + создание заказа (всё или ничего)
    let reserved: {
        order: { id: string; email: string }
        lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
        amountInCents: number
    }

    try {
        reserved = await db.transaction(async (tx) => {
            const items = await tx.query.cartItem.findMany({
                where: eq(cartItem.cartId, cartId),
                with: { product: true, productSize: true },
            })
            if (items.length === 0) throw new Error("CART_EMPTY")

            // РЕЗЕРВ: блокируем строки стока в детерминированном порядке (против дедлоков)
            const sizeIds = items.map((i) => i.productSizeId)
            const locked = await tx
                .select()
                .from(productSize)
                .where(inArray(productSize.id, sizeIds))
                .orderBy(asc(productSize.id))
                .for("update")
            const stockMap = new Map(locked.map((s) => [s.id, s]))

            let amountInCents = 0
            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

            for (const item of items) {
                const stock = stockMap.get(item.productSizeId)
                if (!stock || stock.stockAmount < item.quantity) {
                    throw new Error(`OUT_OF_STOCK:${item.productId}`) // → rollback всего
                }
                // списываем = резервируем на время чекаута
                await tx.update(productSize)
                    .set({ stockAmount: stock.stockAmount - item.quantity })
                    .where(eq(productSize.id, item.productSizeId))

                const unitAmount = Math.round(Number(item.priceAtAddition) * 100)
                amountInCents += unitAmount * item.quantity

                lineItems.push({
                    quantity: item.quantity,
                    price_data: {
                        currency: "eur",
                        unit_amount: unitAmount,
                        product_data: { name: item.product.name },
                    },
                })
            }

            const [createdOrder] = await tx.insert(order).values({
                userId,
                email,
                addressSnapshot: input.address,
                totalAmount: (amountInCents / 100).toFixed(2),
                paymentStatus: "pending",
                fulfillmentStatus: "unfulfilled",
                cartId, // чтобы вебхук почистил корзину без cookies
            }).returning({ id: order.id, email: order.email })

            await tx.insert(orderItem).values(
                items.map((i) => ({
                    orderId: createdOrder.id,
                    productId: i.productId,
                    productSizeId: i.productSizeId,
                    quantity: i.quantity,
                    size: i.productSize.size,
                    price: i.priceAtAddition,
                    productSnapshot: { name: i.product.name },
                })),
            )

            return { order: createdOrder, lineItems, amountInCents }
        })
    } catch (e) {
        // ВСЕ ветки возвращают результат — наружу сырой throw не уходит
        console.error("createCheckout reservation failed", e)
        const msg = String(e)
        if (msg.includes("OUT_OF_STOCK")) return { ok: false, error: "OUT_OF_STOCK" }
        if (msg.includes("CART_EMPTY")) return { ok: false, error: "CART_EMPTY" }
        return { ok: false, error: "UNKNOWN" }
    }

    const { order: createdOrder, lineItems, amountInCents } = reserved

    // 4. Stripe-сессия + журнал платежа (СНАРУЖИ транзакции — сеть не держим под блокировкой)
    try {
        const checkoutSession = await stripe.checkout.sessions.create(
            {
                mode: "payment",
                line_items: lineItems,
                metadata: { orderId: createdOrder.id },
                payment_intent_data: { metadata: { orderId: createdOrder.id } },
                customer_email: createdOrder.email,
                expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_SESSION_TTL_SECONDS,
                success_url: `${process.env.APP_URL}/checkout?step=3?id=${createdOrder.id}`,
                cancel_url: `${process.env.APP_URL}/cart?canceled=${createdOrder.id}`,
            },
            { idempotencyKey: `checkout-${createdOrder.id}` },
        )

        if (!checkoutSession.url) throw new Error("STRIPE_NO_CHECKOUT_URL")

        await db.insert(payment).values({
            orderId: createdOrder.id,
            stripeCheckoutSessionId: checkoutSession.id,
            stripePaymentIntentId:
                typeof checkoutSession.payment_intent === "string"
                    ? checkoutSession.payment_intent
                    : null,
            amount: amountInCents,
            currency: "eur",
            status: "pending",
        })

        return { ok: true, url: checkoutSession.url }
    } catch (err) {
        // заказ и резерв уже закоммичены, а Stripe упал → компенсируем
        await releaseStock(createdOrder.id, "failed")
        console.error("createCheckout stripe step failed", err)
        return { ok: false, error: "UNKNOWN" }
    }
}