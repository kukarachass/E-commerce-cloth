"use server"
// ─── ТИПЫ ───────────────────────────────────────────────────
// Снапшот адреса — то, что ляжет в order.addressSnapshot (JSON).
// Поля повторяют твою таблицу address.
import {db} from "@/db";
import {cartItem, order, orderItem, payment, productSize} from "@/db/schema";
import {asc, eq, inArray} from "drizzle-orm";
import Stripe from "stripe";
import {stripe} from "@/lib/stripe/stripe";
import {releaseStock} from "@/actions/checkout/releaseStock";
import {getServerSession} from "@/lib/get-session";
import {resolveCurrentCart} from "@/actions/checkout/resolveCurrentCart";
import {AddressSnapshot} from "@/types/IOrder";



// Вход Server Action. userId опционален — у гостя его нет.
type CheckoutInput = {
    email?: string   // нужен ТОЛЬКО гостю; у залогиненного берём из сессии
    address: AddressSnapshot
}

// Что возвращаем клиенту.
type CheckoutResult =
    | { ok: true; url: string }
    | { ok: false; error: "CART_EMPTY" | "OUT_OF_STOCK" | "EMAIL_REQUIRED" | "UNKNOWN" }

export async function createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const session = await getServerSession();
    const userId = session?.user.id ?? null;
    const email = userId ? session!.user.email : input.email;
    if (!email) return { ok: false, error: "EMAIL_REQUIRED" }

    const cartId = await resolveCurrentCart(userId);
    if (!cartId) return { ok: false, error: "CART_EMPTY" }

    // ═══ ШАГ 1: ТРАНЗАКЦИЯ ═══
    // Теперь возвращаем НЕ только order, а ещё lineItems и сумму в центах —
    // чтобы они были видны в блоке Stripe СНАРУЖИ. Это и был твой баг:
    // items жил внутри callback'а и наружу не попадал.

    const { createdOrder, lineItems, amountInCents } = await db.transaction(async (tx) => {
        // 1.1 — позиции корзины со связями
        const items = await tx.query.cartItem.findMany({
            where: eq(cartItem.cartId, cartId),
            with: { product: true, productSize: true },
        })
        if (items.length === 0) throw new Error("CART_EMPTY")

        // 1.2 — блокируем строки стока В ДЕТЕРМИНИРОВАННОМ ПОРЯДКЕ
        // const sizeIds = items.map((item) => item.productSizeId)
        // const lockedSizes = await tx
        //     .select()
        //     .from(productSize)
        //     .where(inArray(productSize.id, sizeIds))
        //     .orderBy(asc(productSize.id))
        //     .for("update")
        //
        // const stockMap = new Map(lockedSizes.map((s) => [s.id, s]))

        // 1.3 — проверка наличия + списание + ОДНОВРЕМЕННО готовим данные для Stripe
        let amountInCents = 0;
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

        for(const item of items){
            // const stock = stockMap.get(item.productSizeId);
            // if (!stock || stock.stockAmount < item.quantity) throw new Error(`OUT_OF_STOCK:${item.productId}`);
            //
            // await tx.update(productSize)
            //     .set({ stockAmount: stock.stockAmount - item.quantity })
            //     .where(eq(productSize.id, item.productSizeId))

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

        // 1.4 — заказ. totalAmount выводим ИЗ amountInCents → совпадает со Stripe до цента
        const [createdOrder] = await tx.insert(order).values({
            userId: userId ?? null,
            email,
            addressSnapshot: input.address,
            totalAmount: (amountInCents / 100).toFixed(2),
            paymentStatus: "pending",
            fulfillmentStatus: "unfulfilled",
        }).returning();

        // 1.5 — позиции заказа со снапшотами
        await tx.insert(orderItem).values(
            items.map((i) => ({
                productSizeId: i.productSizeId,
                orderId: createdOrder.id,
                productId: i.productId,
                quantity: i.quantity,
                size: i.productSize.size,
                price: i.priceAtAddition,
                productSnapshot: { name: i.product.name },
            })),
        )
        return { createdOrder, lineItems, amountInCents }
    })

    try{
        const session = await stripe.checkout.sessions.create(
            {
                mode: "payment",
                line_items: lineItems,                  // ← теперь в области видимости
                metadata: { orderId: createdOrder.id },
                payment_intent_data: {
                    metadata: { orderId: createdOrder.id },     // ← бирка ещё и на PaymentIntent
                },
                customer_email: createdOrder.email,
                success_url: `${process.env.APP_URL}/order/success?id=${createdOrder.id}`,
                cancel_url: `${process.env.APP_URL}/cart`,
            },
            { idempotencyKey: `checkout-${createdOrder.id}` },
        )

        // session.url по типам Stripe = string | null. Сужаем до string.
        if (!session.url) throw new Error("STRIPE_NO_CHECKOUT_URL")

        // ═══ ШАГ 3: журналим платёж ═══
        await db.insert(payment).values({
            orderId: createdOrder.id,
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId:
                typeof session.payment_intent === "string" ? session.payment_intent : null,
            amount: amountInCents,
            currency: "eur",
            status: "pending",
        })

        return { ok: true, url: session.url }
    }catch(err){
        await releaseStock(createdOrder.id, "failed")
        return { ok: false, error: "UNKNOWN" }
    }

}
