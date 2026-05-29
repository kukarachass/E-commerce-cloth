import {getCategoryIds} from "@/lib/db-helpers";
import {db} from "@/db";
import {product, productSize} from "@/db/schema";
import {and, eq, inArray} from "drizzle-orm";

export async function getSizes({ gender, categorySlug }: { gender: string, categorySlug: string }) {
    const categoryIds = await getCategoryIds(gender, categorySlug)

    const result = await db.selectDistinct({
        id: productSize.id,
        size: productSize.size,
    })
        .from(productSize)
        .innerJoin(product, and(
            eq(productSize.productId, product.id),
            eq(product.gender, gender),
            inArray(product.categoryId, categoryIds),
            eq(product.isActive, true),
        ))
        .orderBy(productSize.size)

    return result;
}