"use server"

import { and, desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { order } from "@/db/schema"
import { getServerSession } from "@/lib/get-session"
import { resolveCurrentCart } from "@/actions/checkout/resolveCurrentCart"

export async function getActivePendingOrder() {
    const session = await getServerSession()
    const userId = session?.user.id ?? null
    const cartId = await resolveCurrentCart(userId)
    if (!userId && !cartId) return null

    const [ord] = await db
        .select({ id: order.id, totalAmount: order.totalAmount })
        .from(order)
        .where(
            and(
                eq(order.paymentStatus, "pending"),
                userId ? eq(order.userId, userId) : eq(order.cartId, cartId!),
            ),
        )
        .orderBy(desc(order.createdAt))
        .limit(1)

    return ord ?? null
}