import {getCategoryIds} from "@/lib/db-helpers";
import {db} from "@/db";
import {product, productStyle, style} from "@/db/schema";
import {and, eq, inArray} from "drizzle-orm";

export async function getStyles({gender, categorySlug}: { gender: string, categorySlug: string }) {
    const categoryIds = categorySlug === "new-items"
        ? undefined
        : await getCategoryIds(gender, categorySlug)

    const result = await db.selectDistinct({
        id: style.id,
        style: style.name
    })
        .from(productStyle)
        .innerJoin(style, eq(style.id, productStyle.styleId))
        .innerJoin(product, and(
            eq(productStyle.productId, product.id),
            eq(product.gender, gender),
            categoryIds ? inArray(product.categoryId, categoryIds) : undefined,
            eq(product.isActive, true),
        ))
        .orderBy(style.name)

    return result;
}