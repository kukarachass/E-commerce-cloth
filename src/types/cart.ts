// types/cart.ts
import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { cart, cartItem, productSize } from "@/db/schema"
import {ProductWithDetails} from "@/types/product-details";
import {db} from "@/db";

export type ICart = InferSelectModel<typeof cart>
export type NewCart = InferInsertModel<typeof cart>

export type ICartItem = InferSelectModel<typeof cartItem>
export type NewCartItem = InferInsertModel<typeof cartItem>

export type ProductSize = InferSelectModel<typeof productSize>

export type DbTransaction = Parameters<
    Parameters<typeof db.transaction>[0]
>[0]

export type CartItemWithDetails = ICartItem & {
    product: ProductWithDetails
    productSize: ProductSize
}

export type CartWithItems = ICart & {
    items: CartItemWithDetails[]
}

export type CartWithConfig = CartWithItems & {
    isShippingFree: boolean
    shippingFee: number
    customsFee: number
    freeShippingThreshold: number
    totalSaved: number;

}