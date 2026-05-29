import {getCategoryIds} from "@/lib/db-helpers";
import {db} from "@/db";
import {color, product, productColor, productSize} from "@/db/schema";
import {and, eq, inArray} from "drizzle-orm";

export async function getColors({gender, categorySlug}: { gender: string, categorySlug: string }) {
    const categoryIds = await getCategoryIds(gender, categorySlug)

    const result = await db.selectDistinct({
        id: color.id,
        hex: color.hex,
        name: color.name,
    })
        .from(productColor)
        .innerJoin(color, eq(color.id, productColor.colorId))
        .innerJoin(product, and(
            eq(productColor.productId, product.id),
            eq(product.gender, gender),
            inArray(product.categoryId, categoryIds),
            eq(product.isActive, true),
        ))
        .orderBy(color.name)

    return result;

}
