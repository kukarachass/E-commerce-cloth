"use server"

import { and, desc, eq, gte } from "drizzle-orm"
import { db } from "@/db"
import { order } from "@/db/schema"
import { getServerSession } from "@/lib/get-session"
import { getItemReturnState } from "@/lib/returns/itemReturnable"

const RETURN_WINDOW_DAYS = 30

const itemsWith = {
    items: {
        with: {
            product: { with: { images: true } },
            returnItems: { with: { request: true } },
        },
    },
} as const

export async function getReturnableOrders() {
    const session = await getServerSession()
    if (!session?.user.id)  return { returnableOrders: [], instantReturnableOrders: [] }


    const windowStart = new Date()
    windowStart.setDate(windowStart.getDate() - RETURN_WINDOW_DAYS)

    const rawOrders = await db.query.order.findMany({
        where: and(
            eq(order.userId, session.user.id),
            eq(order.fulfillmentStatus, "delivered"), // возвращают доставленное
            eq(order.paymentStatus, "paid"),
            gte(order.createdAt, windowStart),
        ),
        orderBy: desc(order.createdAt),
        with: itemsWith
    })

    const instantReturnableOrders = await db.query.order.findMany({
        where: and(
            eq(order.userId, session.user.id),
            eq(order.paymentStatus, "paid"),
            gte(order.createdAt, windowStart),
        ),
        orderBy: desc(order.createdAt),
        with: itemsWith
    })

    // оставляем заказы, где есть ХОТЬ ОДНА позиция с остатком к возврату
    const returnableOrders = rawOrders.filter((ord) =>
        ord.items.some((item) => getItemReturnState(item).isReturnable),
    )

    return { returnableOrders, instantReturnableOrders }
}

