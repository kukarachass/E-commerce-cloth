import {getCategoryIds} from "@/lib/db-helpers";
import {db} from "@/db";
import {product} from "@/db/schema";
import {and, eq, inArray} from "drizzle-orm";
import {FilterProps} from "@/types/filters/filters-props";

export async function getDiscounts({gender, categorySlug, productIds}: FilterProps) {
    const categoryIds = !categorySlug || categorySlug === "new-items"
        ? undefined
        : await getCategoryIds(gender, categorySlug)

    const filter =
        productIds ?
            inArray(product.id, productIds) :
            categoryIds
                ? inArray(product.categoryId, categoryIds)
                : undefined;

    const result = db.selectDistinct({
        discount: product.discount
    })
        .from(product)
        .where(and(
            eq(product.gender, gender),
            filter,
            eq(product.isActive, true),
        ))
        .orderBy(product.discount)
    return result;
}