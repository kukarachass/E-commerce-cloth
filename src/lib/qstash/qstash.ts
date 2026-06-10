// lib/qstash.ts
import "server-only"
import { Client } from "@upstash/qstash"

export const qstash = new Client({ token: process.env.QSTASH_TOKEN! })

// «положить в очередь задание на письмо»
export async function enqueueOrderConfirmation(orderId: string) {
    await qstash.publishJSON({
        url: `${process.env.APP_URL}/api/jobs/order-confirmation`, // КУДА QStash потом постучится
        body: { orderId },                                         // ЧТО передать
        retries: 3,                                                // сколько раз повторить при сбое
    })
}