import {getCategoryIds} from "@/lib/db-helpers";
import {db} from "@/db";
import {and, eq, inArray} from "drizzle-orm";
import {product} from "@/db/schema";
import {max, min} from "drizzle-orm";
import {FilterProps} from "@/types/filters/filters-props";

export async function getPrice({ gender, categorySlug, productIds}: FilterProps) {
    const categoryIds = !categorySlug || categorySlug === "new-items"
        ? undefined
        : await getCategoryIds(gender, categorySlug)

    const filter =
        productIds ?
            inArray(product.id, productIds) :
            categoryIds
                ? inArray(product.categoryId, categoryIds)
                : undefined;

    const result = await db.select({
        minPrice: min(product.originalPrice),
        maxPrice: max(product.originalPrice),
    })
        .from(product)
        .where(and(
            eq(product.gender, gender),
            filter,
            eq(product.isActive, true),
        ))

    return result;
}
