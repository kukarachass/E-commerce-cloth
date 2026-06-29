"use server"

import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { order } from "@/db/schema"
import { getServerSession } from "@/lib/get-session"

export async function getReturnHistory() {
    const session = await getServerSession()
    if (!session?.user.id) return []

    const orders = await db.query.order.findMany({
        where: eq(order.userId, session.user.id),
        orderBy: desc(order.createdAt),
        with: {
            items: {
                with: {
                    product: { with: { images: true } },
                    returnItems: { with: { request: true } },
                },
            },
        },
    })

    if(!orders) throw new Error("Orders not found");

    // оставляем только заказы, где есть ХОТЬ ОДИН возврат (любой статус, кроме чисто отменённого)
    return orders.filter((ord) =>
        ord.items.some((item) =>
            item.returnItems.some((ri) => ri.status !== "cancelled"),
        ),
    )
}