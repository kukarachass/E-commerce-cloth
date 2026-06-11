import {InferSelectModel} from "drizzle-orm";
import {order} from "@/db/schema";

export type IOrder = InferSelectModel<typeof order>
export type AddressSnapshot = {
    street: string
    houseNumber: string
    houseAddition: string | null   // ? = необязательное поле
    postcode: string
    city: string
    country: string
}
