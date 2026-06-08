import {InferSelectModel} from "drizzle-orm";
import {order} from "@/db/schema";

export type IOrder = InferSelectModel<typeof order>
