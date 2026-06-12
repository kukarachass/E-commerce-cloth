import {InferSelectModel} from "drizzle-orm";
import {order} from "@/db/schema";

export type IOrder = InferSelectModel<typeof order>
export type AddressSnapshot = {
    street: string
    houseNumber: string
    houseAddition: string | null
    postcode: string
    city: string
    country: string
}
