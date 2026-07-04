import {NextResponse} from "next/server";
import Stripe from "stripe";
import {stripe} from "@/lib/stripe/stripe";
import {webhookEvent} from "@/db/schema";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {
    handleChargeRefunded,
    handleCheckoutCompleted,
    handleCheckoutExpired, handlePaymentFailed
} from "@/actions/checkout/checkoutHandlers";
import {enqueueOrderConfirmation} from "@/lib/qstash/qstash";

export const runtime = "nodejs"
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    // ─── 1. RAW BODY (сырой текст, НЕ json!) ───
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) return NextResponse.json({error: "No signature, слабовато братик"}, {status: 400})

    // ─── 2. ПРОВЕРКА ПОДПИСИ — до любого доступа к БД ───
    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
        return NextResponse.json({error: "Invalid signature, хуйня какая то братанчик"}, {status: 400})
    }

    // ─── 3. Гарантируем, что строка события есть (ДО транзакции) ───
    await db.insert(webhookEvent)
        .values({id: event.id, type: event.type, status: "pending", payload: event})
        .onConflictDoNothing()

// ─── 4. Блокируем → проверяем → обрабатываем → помечаем ───
    try {
        const result = await db.transaction(async (tx) => {
            const [evt] = await tx.select({status: webhookEvent.status})
                .from(webhookEvent).where(eq(webhookEvent.id, event.id))
                .for("update")

            if (!evt) throw new Error(`webhookEvent ${event.id} not found`)

            // дубль → возвращаем ФЛАГ-ОБЪЕКТ, а не NextResponse
            if (evt.status === "processed") return {alreadyDone: true}

            switch (event.type) {
                case "checkout.session.completed":
                    await handleCheckoutCompleted(tx, event.data.object as Stripe.Checkout.Session);
                    break
                case "checkout.session.expired":
                    await handleCheckoutExpired(tx, event.data.object);
                    break
                case "payment_intent.payment_failed":
                    await handlePaymentFailed(tx, event.data.object as Stripe.PaymentIntent);
                    break
                case "charge.refunded":
                    await handleChargeRefunded(tx, event.data.object as Stripe.Charge);
                    break
                default:
                    break
            }

            await tx.update(webhookEvent)
                .set({status: "processed", processedAt: new Date()})
                .where(eq(webhookEvent.id, event.id))

            return {alreadyDone: false}   // ← обязательный второй return
        })

        // теперь result точно { alreadyDone: boolean } → поле есть, TS доволен
        if (!result.alreadyDone && event.type === "checkout.session.completed") {
            const orderId = (event.data.object as Stripe.Checkout.Session).metadata?.orderId
            if (orderId) {
                try {
                    await enqueueOrderConfirmation(orderId)
                } catch (e) {
                    console.error("enqueue confirmation failed", e)
                }
            }
        }

    } catch (err) {
        await db.update(webhookEvent)
            .set({status: "failed", error: String(err)})
            .where(eq(webhookEvent.id, event.id))
        return NextResponse.json({error: "Processing failed"}, {status: 500})
    }

// ─── 5. 200 OK ───
    return NextResponse.json({received: true})
}