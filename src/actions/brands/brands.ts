"use server"

import { db } from "@/db"
import { brand, product } from "@/db/schema"
import { and, eq, inArray } from "drizzle-orm"
import {getCategoryIds} from "@/lib/db-helpers";

export async function getBrands({ gender, categorySlug }: { gender: string, categorySlug: string }) {

    const categoryIds = await getCategoryIds(gender, categorySlug)

    const result = await db.selectDistinct({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
    })
        .from(brand)
        .innerJoin(product, and(
            eq(product.brandId, brand.id),
            eq(product.gender, gender),
            inArray(product.categoryId, categoryIds),
            eq(product.isActive, true),
        ))
        .orderBy(brand.name)

    return result
}