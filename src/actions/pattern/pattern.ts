import {getCategoryIds} from "@/lib/db-helpers";
import {db} from "@/db";
import {pattern, product, productPattern} from "@/db/schema";
import {and, eq, inArray} from "drizzle-orm";
import {FilterProps} from "@/types/filters/filters-props";

export async function getPatterns({gender, categorySlug, productIds}: FilterProps) {
    const categoryIds = !categorySlug || categorySlug === "new-items"
        ? undefined
        : await getCategoryIds(gender, categorySlug)

    const filter =
        productIds ?
            inArray(productPattern.productId, productIds) :
            categoryIds
                ? inArray(product.categoryId, categoryIds)
                : undefined;

    const result = await db.selectDistinct({
        id: pattern.id,
        pattern: pattern.name
    })
        .from(productPattern)
        .innerJoin(pattern, eq(pattern.id, productPattern.patternId))
        .innerJoin(product, and(
            eq(productPattern.productId, product.id),
            eq(product.gender, gender),
            filter,
            eq(product.isActive, true),
        ))
        .orderBy(pattern.name)

    return result;
}