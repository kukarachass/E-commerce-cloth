"use server"

import { db } from "@/db"
import {GetOrCreateCart} from "@/actions/cart/get-or-create-cart"
import {cartItem, productSize} from "@/db/schema"
import updateCartTotalAmount from "@/actions/cart/update-total-amount"
import {and, count, eq} from "drizzle-orm"
import {CART_COOKIE_NAME, CART_MAX_ITEMS, CART_MAX_QUANTITY_PER_ITEM} from "@/lib/cart-constants";
import {ApplyCartCookieAction} from "@/actions/cart/apply-cart-cookies";
import {cookies} from "next/headers";


interface AddProductToCartProps {
    userId: string | null
    productSizeId: string
    quantity: number
    productId: string
}


export async function AddProductToCart({
                                           userId,
                                           productSizeId,
                                           quantity,
                                           productId,
                                       }: AddProductToCartProps) {
    if (quantity <= 0 || quantity > CART_MAX_QUANTITY_PER_ITEM) {
        throw new Error(`Quantity must be between 1 and ${CART_MAX_QUANTITY_PER_ITEM}`)
    }
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get(CART_COOKIE_NAME)?.value ?? null


    const result = await db.transaction(async (tx) => {
        const userCart = await GetOrCreateCart({
            userId,
            cookieToken,
            tx,
        })

        const product = await tx.query.product.findFirst({
            where: (product, { eq, and }) => and(
                eq(product.id, productId),
                eq(product.isActive, true),
            ),
        })
        if (!product) throw new Error("Product not found")

        const [size] = await tx
            .select()
            .from(productSize)
            .where(
                and(
                    eq(productSize.id, productSizeId),
                    eq(productSize.productId, productId),
                )
            )
            .for("update") // блокируем строку — другие транзакции встанут в очередь
            .limit(1)

        if (!size) {
            throw new Error(`Size is not available for this product`)
        }

        const existingCartItem = await tx.query.cartItem.findFirst({
            where: (cartItem, { eq, and }) => and(
                eq(cartItem.cartId, userCart.cart.id),
                eq(cartItem.productSizeId, productSizeId),
            ),
        })

        if (!existingCartItem) {
            const [{ value: itemCount }] = await tx
                .select({ value: count() })
                .from(cartItem)
                .where(eq(cartItem.cartId, userCart.cart.id))

            if (itemCount >= CART_MAX_ITEMS) {
                throw new Error("Cart is full")
            }
        }

        const nextQuantity = existingCartItem
            ? existingCartItem.quantity + quantity
            : quantity

        if (nextQuantity > CART_MAX_QUANTITY_PER_ITEM) throw new Error(`Cannot add more than ${CART_MAX_QUANTITY_PER_ITEM} of the same item`)
        if (size.stockAmount < nextQuantity) throw new Error("Not enough stock for this product size")

        const fixedPrice = product.discountPrice ?? product.originalPrice


        if (existingCartItem) {
            await tx
                .update(cartItem)
                .set({ quantity: nextQuantity })
                .where(eq(cartItem.id, existingCartItem.id))
        } else {
            await tx.insert(cartItem).values({
                cartId: userCart.cart.id,
                productId,
                productSizeId,
                quantity,
                priceAtAddition: fixedPrice, // ← фиксируем
            })
        }

        const updatedCart = await updateCartTotalAmount(tx, userCart.cart.id)

        return {
            cart: updatedCart,
            cookie: userCart.cookie,
        }
    })

    await ApplyCartCookieAction(result.cookie)

    return result.cart
}