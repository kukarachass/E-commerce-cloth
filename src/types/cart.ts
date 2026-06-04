// types/cart.ts
import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { cart, cartItem, productSize } from "@/db/schema"
import {ProductWithDetails} from "@/types/product-details";
import {db} from "@/db";

export type ICart = InferSelectModel<typeof cart>
export type NewCart = InferInsertModel<typeof cart>

export type CartItem = InferSelectModel<typeof cartItem>
export type NewCartItem = InferInsertModel<typeof cartItem>

export type ProductSize = InferSelectModel<typeof productSize>

export type DbTransaction = Parameters<
    Parameters<typeof db.transaction>[0]
>[0]

export type CartItemWithDetails = CartItem & {
    product: ProductWithDetails
    productSize: ProductSize
}

export type CartWithItems = ICart & {
    items: CartItemWithDetails[]
}

export type AddToCartInput = {
    productId: string
    productSizeId: string
    quantity: number
}

export type UpdateCartItemInput = {
    cartItemId: string
    quantity: number
}

export type RemoveCartItemInput = {
    cartItemId: string
}

export type GetOrCreateCartInput = {
    userId?: string | null
    token?: string | null
}

export type MergeCartInput = {
    userId: string
    cookieToken: string
}