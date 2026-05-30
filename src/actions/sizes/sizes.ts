import {getCategoryIds} from "@/lib/db-helpers";
import {db} from "@/db";
import {product, productSize} from "@/db/schema";
import {and, eq, inArray} from "drizzle-orm";
import {Gender} from "@/store/useGenderStore";

export async function getSizes({ gender, categorySlug }: { gender: Gender, categorySlug: string }) {
    const categoryIds = categorySlug === "new-items"
        ? undefined
        : await getCategoryIds(gender, categorySlug)

    return db.selectDistinct({
        id: productSize.id,
        size: productSize.size,
    })
        .from(productSize)
        .innerJoin(product, and(
            eq(productSize.productId, product.id),
            eq(product.gender, gender),
            categoryIds ? inArray(product.categoryId, categoryIds) : undefined,
            eq(product.isActive, true),
        ))
        .orderBy(productSize.size)
}