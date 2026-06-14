"use server"

import {db} from "@/db"
import {cookies} from "next/headers"
import {CART_COOKIE_NAME} from "@/lib/cart-constants"
import {hashCartToken} from "@/actions/cart/make-cart-token"

interface GetCartProps {
    userId: string | null
}

export async function getCart({ userId }: GetCartProps) {
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get(CART_COOKIE_NAME)?.value ?? null
    const cookieTokenHash = cookieToken ? hashCartToken(cookieToken) : null

    const [result, config] = await Promise.all([
        db.query.cart.findFirst({
            where: (cart, {eq}) =>
                userId
                    ? eq(cart.userId, userId)
                    : eq(cart.token, cookieTokenHash || ""),
            with: {
                items: {
                    orderBy: (item, {desc}) => [desc(item.createdAt)],
                    with: {
                        product: {
                            with: {
                                images: true,
                                brand: true,
                                sizes: true,
                            }
                        },
                        productSize: true,
                    }
                }
            }
        }),
        db.query.storeConfig.findFirst(),
    ])

    if (!result) return null

    const isShippingFree = config?.isFreeShippingEnabled
        ? Number(result.grandTotal) >= Number(config.freeShippingThreshold)
        : false

    let totalSaved = 0;

    for(const item of result.items) {
        const { product } = item;
        if(product.discountPrice) totalSaved += (Number(product.originalPrice) - Number(product.discountPrice)) * item.quantity

    }


    // total saved -> сколько пользователь съекономил с помощью скидок на продукты, то есть нужно пройтись по каждому айтему в коризне у которого priceDiscount > 0 и вычесть сумму originalPrice - priceDiscount и записать это в переменную totalSaved

    return {
        ...result,
        isShippingFree,
        totalSaved,
        shippingFee: Number(config?.shippingFee ?? 0),
        customsFee: Number(config?.customsFee ?? 0),
        freeShippingThreshold: Number(config?.freeShippingThreshold ?? 0),
    }
}