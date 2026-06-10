import {payment} from "@/db/schema";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {releaseStock} from "@/actions/checkout/releaseStock";
import {stripe} from "@/lib/stripe/stripe";
import {handleCheckoutCompleted, handleCheckoutExpired} from "@/actions/checkout/checkoutHandlers";
import {enqueueOrderConfirmation} from "@/lib/qstash/qstash";

export async function reconcileOrder(orderId: string){

    // находим платёж, чтобы узнать id сессии Stripe
    const [pay] = await db.select()
        .from(payment)
        .where(eq(payment.orderId, orderId))

    // ── СЛУЧАЙ A: нет платежа / нет session id → сессия не создавалась = сирота ──
    if (!pay?.stripeCheckoutSessionId) {
        await releaseStock(orderId, "failed")
        return
    }

    // спрашиваем у Stripe реальный статус сессии
    const session = await stripe.checkout.sessions.retrieve(pay.stripeCheckoutSessionId);

    // ── СЛУЧАЙ B: реально оплачено → мы пропустили вебхук → восстанавливаем ──
    if(session.status === "complete" && session.payment_status === "paid"){
        // переиспользуем ТОТ ЖЕ обработчик, что и вебхук. Он идемпотентен:
        // залочит заказ, увидит pending → пометит paid. Если уже paid — ничего не сделает.
        await db.transaction((tx) => handleCheckoutCompleted(tx, session))
        await enqueueOrderConfirmation(orderId) // дослать письмо (флаг confirmationSentAt защитит от дубля)
        return
    }

    // ── СЛУЧАЙ C: сессия истекла → вернуть сток ──
    if (session.status === "expired") {
        await db.transaction((tx) => handleCheckoutExpired(tx, session))
        return
    }

    // ── СЛУЧАЙ D: session.status === "open" → ещё открыта, человек может оплатить ──
    // Не трогаем. Stripe сам пометит её expired по истечении и пришлёт вебхук.


}