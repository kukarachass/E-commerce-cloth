"use server"

import { cookies } from "next/headers";
import { CART_COOKIE_NAME } from "@/lib/cart-constants";
import { hashCartToken } from "@/actions/cart/make-cart-token";
import { db } from "@/db";

export async function resolveCurrentCart(userId: string | null) {
    const cookieStore = await cookies();

    const cookieToken = cookieStore.get(CART_COOKIE_NAME)?.value;
    const cookieTokenHash = cookieToken
        ? hashCartToken(cookieToken)
        : null;

    if (userId) {
        const cart = await db.query.cart.findFirst({
            where: (cart, { eq }) => eq(cart.userId, userId),
        });

        return cart?.id ?? null;
    }

    if (cookieTokenHash) {
        const cart = await db.query.cart.findFirst({
            where: (cart, { eq }) => eq(cart.token, cookieTokenHash),
        });

        return cart?.id ?? null;
    }

    return null;
}