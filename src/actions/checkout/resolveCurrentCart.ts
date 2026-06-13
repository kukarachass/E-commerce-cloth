"use server"

import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { db } from "@/db"
import { cart } from "@/db/schema"
import { CART_COOKIE_NAME } from "@/lib/cart-constants"
import { hashCartToken } from "@/actions/cart/make-cart-token"

export async function resolveCurrentCart(userId: string | null): Promise<string | null> {
    if (userId) {
        const c = await db.query.cart.findFirst({ where: eq(cart.userId, userId) })
        return c?.id ?? null
    }
    const token = (await cookies()).get(CART_COOKIE_NAME)?.value
    if (!token) return null
    const c = await db.query.cart.findFirst({ where: eq(cart.token, hashCartToken(token)) })
    return c?.id ?? null
}