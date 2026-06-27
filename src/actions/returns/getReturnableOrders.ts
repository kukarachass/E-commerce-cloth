"use server"

import { and, desc, eq, gte } from "drizzle-orm"
import { db } from "@/db"
import { order } from "@/db/schema"
import { getServerSession } from "@/lib/get-session"

const RETURN_WINDOW_DAYS = 30

export async function getReturnableOrders() {
    const session = await getServerSession()
    if (!session?.user.id) return []

    const windowStart = new Date()
    windowStart.setDate(windowStart.getDate() - RETURN_WINDOW_DAYS)

    return db.query.order.findMany({
        where: and(
            eq(order.userId, session.user.id),
            eq(order.fulfillmentStatus, "shipped"),
            eq(order.paymentStatus, "paid"),
            gte(order.createdAt, windowStart), // ← нужна колонка deliveredAt; иначе createdAt
        ),
        orderBy: desc(order.createdAt),
        with: {
            items: {
                with: {
                    product: {
                        with: { images: true }, // ← только то, что показываем
                    },
                },
            },
        },
    })
}

export type ReturnableOrder = Awaited<ReturnType<typeof getReturnableOrders>>[number]
export type ReturnableItem = ReturnableOrder["items"][number]