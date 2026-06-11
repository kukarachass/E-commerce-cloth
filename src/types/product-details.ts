// types/product.ts
import { InferSelectModel } from "drizzle-orm"
import { product, productSize, productImage, brand } from "@/db/schema"

export type ProductWithDetails = InferSelectModel<typeof product> & {
    sizes: InferSelectModel<typeof productSize>[]
    images: InferSelectModel<typeof productImage>[]
    brand: InferSelectModel<typeof brand>
}

export type productImages = InferSelectModel<typeof productImage>