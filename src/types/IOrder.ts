import {InferSelectModel} from "drizzle-orm";
import {order, orderItem} from "@/db/schema";
import {ProductWithDetails} from "@/types/product-details";
import {getOrders} from "@/actions/order/getOrders";
import {ReturnableOrder} from "@/types/returns";

export type IOrder = InferSelectModel<typeof order>
export type IOrderItem = InferSelectModel<typeof orderItem>
export type IOrderItemWithProduct = IOrderItem & {
    product: ProductWithDetails;
}

export type IOrderWithReturns = Awaited<ReturnType<typeof getOrders>>[number]
export type AddressSnapshot = {
    street: string
    houseNumber: string
    houseAddition: string | null
    postcode: string
    city: string
    country: string
}

export type ReturnableOrderItem = ReturnableOrder["items"][number]
