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

export const runtime = "nodejs"
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request){
    // ─── 1. RAW BODY (сырой текст, НЕ json!) ───
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if(!signature) return NextResponse.json({ error: "No signature, слабовато братик" }, { status: 400 })

    // ─── 2. ПРОВЕРКА ПОДПИСИ — до любого доступа к БД ───
    let event: Stripe.Event
    try{
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    }catch(err){
        return NextResponse.json({ error: "Invalid signature, хуйня какая то братанчик" }, { status: 400 })
    }

    // ─── 3+4. Блокируем строку → проверяем → обрабатываем → помечаем — ВСЁ в одной транзакции ───

    try{
        await db.transaction(async (tx) => {
            // блокируем строку события. ВТОРАЯ копия запроса встанет здесь и будет ждать.
            const [evt] = await db.select({ status: webhookEvent.status})
                .from(webhookEvent).where(eq(webhookEvent.id, event.id))
                .for("update")

            // получив блокировку, ПЕРЕпроверяем: вдруг первая копия уже всё сделала
            if (evt.status === "processed") return NextResponse.json({ received: true, duplicate: true }) // настоящий дубль → выходим

            switch (event.type) {
                case "checkout.session.completed":
                    await handleCheckoutCompleted(tx, event.data.object)
                    break
                case "checkout.session.expired":
                    await handleCheckoutExpired(tx, event.data.object)
                    break
                case "payment_intent.payment_failed":
                    await handlePaymentFailed(tx, event.data.object)
                    break
                case "charge.refunded":
                    await handleChargeRefunded(tx, event.data.object)
                    break
                default:
                    break
            }

            // помечаем обработанным в ТОЙ ЖЕ транзакции
            await tx.update(webhookEvent)
                .set({ status: "processed", processedAt: new Date() })
                .where(eq(webhookEvent.id, event.id))
        })

    }catch(err){
        await db.update(webhookEvent)
            .set({ status: "failed", error: String(err) })
            .where(eq(webhookEvent.id, event.id))
        return NextResponse.json({ error: "Processing failed" }, { status: 500 })
    }

    // ─── 5. 200 OK ───
    return NextResponse.json({ received: true })
}