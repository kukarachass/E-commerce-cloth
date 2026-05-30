import {getCategoryIds} from "@/lib/db-helpers";
import {db} from "@/db";
import {and, eq, inArray} from "drizzle-orm";
import {product} from "@/db/schema";
import {max, min} from "drizzle-orm";
import {Gender} from "@/store/useGenderStore";

interface GetPriceProps {
    gender: string;
    categorySlug: string;
}
export async function getPrice({ gender, categorySlug }: GetPriceProps) {
    const categoryIds = categorySlug === "new-items"
        ? undefined
        : await getCategoryIds(gender, categorySlug)

    const result = await db.select({
        minPrice: min(product.originalPrice),
        maxPrice: max(product.originalPrice),
    })
        .from(product)
        .where(and(
            eq(product.gender, gender),
            categoryIds ? inArray(product.categoryId, categoryIds) : undefined,
            eq(product.isActive, true),
        ))

    return result;
}
