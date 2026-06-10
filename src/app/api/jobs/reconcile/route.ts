import {db} from "@/db";
import {order} from "@/db/schema";
import {and, eq, lt} from "drizzle-orm";
import {verifySignatureAppRouter} from "@upstash/qstash/nextjs";
import {reconcileOrder} from "@/app/api/jobs/reconcile/reconcileOrder";

export const runtime = "nodejs"

async function handler(){
    // порог: заказы pending, созданные более 30 минут назад
    const cutoff = new Date(Date.now() - 30 * 60 * 1000)

    const stuck = await db.select({ id: order.id})
        .from(order)
        .where(and(
            eq(order.paymentStatus, "pending"), lt(order.createdAt, cutoff)
        ))
        .limit(50) // батч, чтобы один запуск не висел вечно

    for (const ord of stuck){
        try{
            await reconcileOrder(ord.id)
        }catch(err){
            console.error(`reconcile failed for ${ord.id}`, err)

        }
    }

    return Response.json({ checked: stuck.length })
}

export const POST = verifySignatureAppRouter(handler) // та же подпись QStash

