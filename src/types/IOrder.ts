import {InferSelectModel} from "drizzle-orm";
import {order, orderItem} from "@/db/schema";
import {ProductWithDetails} from "@/types/product-details";

export type IOrder = InferSelectModel<typeof order>
export type IOrderItem = InferSelectModel<typeof orderItem>
export type IOrderItemWithProduct = IOrderItem & {
    product: ProductWithDetails;
}
export type AddressSnapshot = {
    street: string
    houseNumber: string
    houseAddition: string | null
    postcode: string
    city: string
    country: string
}
