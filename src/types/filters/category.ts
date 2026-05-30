import { InferSelectModel } from "drizzle-orm"
import { category } from "@/db/schema"

type CategoryBase = InferSelectModel<typeof category>

export type Category = CategoryBase & {
    subcategories?: (CategoryBase & {
        subcategories?: CategoryBase[]
    })[]
}