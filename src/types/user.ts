import { InferSelectModel } from "drizzle-orm"
import { user, address, order } from "@/db/schema"

export type IUser = InferSelectModel<typeof user>
export type IAddress = InferSelectModel<typeof address>
export type IOrder = InferSelectModel<typeof order>

export type IUserWithDetails = IUser & {
    address: IAddress | null
    readyToCheckout: boolean;
    orders: IOrder[]
}