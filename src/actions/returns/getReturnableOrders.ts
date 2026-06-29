"use server"

import { and, desc, eq, gte } from "drizzle-orm"
import { db } from "@/db"
import { order } from "@/db/schema"
import { getServerSession } from "@/lib/get-session"
import { getItemReturnState } from "@/lib/returns/itemReturnable"

const RETURN_WINDOW_DAYS = 30

export async function getReturnableOrders() {
    const session = await getServerSession()
    if (!session?.user.id) return []

    const windowStart = new Date()
    windowStart.setDate(windowStart.getDate() - RETURN_WINDOW_DAYS)

    const orders = await db.query.order.findMany({
        where: and(
            eq(order.userId, session.user.id),
            eq(order.fulfillmentStatus, "delivered"), // возвращают доставленное
            eq(order.paymentStatus, "paid"),
            gte(order.createdAt, windowStart),
        ),
        orderBy: desc(order.createdAt),
        with: {
            items: {
                with: {
                    product: { with: { images: true } },
                    returnItems: { with: { request: true } }, // статус каждой прошлой позиции возврата
                },
            },
        },
    })

    // оставляем заказы, где есть ХОТЬ ОДНА позиция с остатком к возврату
    return orders.filter((ord) =>
        ord.items.some((item) => getItemReturnState(item).isReturnable),
    )
}
