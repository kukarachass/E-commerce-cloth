import {getCategoryIds} from "@/lib/db-helpers";
import {db} from "@/db";
import {color, pattern, product, productColor, productPattern} from "@/db/schema";
import {and, eq, inArray} from "drizzle-orm";

export async function getPatterns({gender, categorySlug}: { gender: string, categorySlug: string }) {
    const categoryIds = await getCategoryIds(gender, categorySlug)

    const result = await db.selectDistinct({
        id: pattern.id,
        pattern: pattern.name
    })
        .from(productPattern)
        .innerJoin(pattern, eq(pattern.id, productPattern.patternId))
        .innerJoin(product, and(
            eq(productPattern.productId, product.id),
            eq(product.gender, gender),
            inArray(product.categoryId, categoryIds),
            eq(product.isActive, true),
        ))
        .orderBy(pattern.name)

    return result;
}