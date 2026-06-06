import {getCategoryIds} from "@/lib/db-helpers";
import {db} from "@/db";
import {product, productStyle, style} from "@/db/schema";
import {and, eq, inArray} from "drizzle-orm";
import {FilterProps} from "@/types/filters/filters-props";

export async function getStyles({gender, categorySlug, productIds}: FilterProps) {
    const categoryIds = !categorySlug || categorySlug === "new-items"
        ? undefined
        : await getCategoryIds(gender, categorySlug)

    const filter =
        productIds ?
            inArray(productStyle.productId, productIds) :
            categoryIds
                ? inArray(product.categoryId, categoryIds)
                : undefined;

    const result = await db.selectDistinct({
        id: style.id,
        style: style.name
    })
        .from(productStyle)
        .innerJoin(style, eq(style.id, productStyle.styleId))
        .innerJoin(product, and(
            eq(productStyle.productId, product.id),
            eq(product.gender, gender),
            filter,
            eq(product.isActive, true),
        ))
        .orderBy(style.name)

    return result;
}