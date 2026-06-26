import {getBrands} from "@/actions/filters/brands/brands";
import {InferSelectModel} from "drizzle-orm";
import {brand, cart} from "@/db/schema";

// export type IBrand = Awaited<ReturnType<typeof getBrands>>[number]
export type IBrand = InferSelectModel<typeof brand>
