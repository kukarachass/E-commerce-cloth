import {InferSelectModel} from "drizzle-orm";
import {order, orderFulfillmentStatusEnum, orderItem, orderPaymentStatusEnum, paymentStatusEnum} from "@/db/schema";
import {ProductWithDetails} from "@/types/product-details";
import {getOrders} from "@/actions/order/getOrders";
import {ReturnableOrder} from "@/types/returns";

export type IOrder = InferSelectModel<typeof order>
export type IOrderItem = InferSelectModel<typeof orderItem>
export type IOrderItemWithProduct = IOrderItem & {
    product: ProductWithDetails;
}

export type OrderPaymentStatus = (typeof orderPaymentStatusEnum.enumValues)[number];
export type OrderFulfillmentStatus = (typeof orderFulfillmentStatusEnum.enumValues)[number];
export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];
export function parseEnumParam<T extends string>(
    value: string | string[] | undefined,
    allowed: readonly T[],
): T | undefined {
    const v = Array.isArray(value) ? value[0] : value;
    if (!v || v === "all") return undefined;
    return allowed.find((a) => a === v);
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
