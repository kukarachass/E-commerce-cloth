import {getCategoryIds} from "@/lib/db-helpers";
import {db} from "@/db";
import {product} from "@/db/schema";
import {and, eq, inArray} from "drizzle-orm";

export async function getDiscounts({gender, categorySlug}: { gender: string, categorySlug: string }) {
    const categoryIds = await getCategoryIds(gender, categorySlug)

    const result = db.selectDistinct({
        discount: product.discount
    })
        .from(product)
        .where(and(
            eq(product.gender, gender),
            inArray(product.categoryId, categoryIds),
            eq(product.isActive, true),
        ))
        .orderBy(product.discount)
    return result;
}