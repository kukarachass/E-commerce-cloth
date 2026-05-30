"use server"

import {db} from "@/db"
import {brand, product} from "@/db/schema"
import {and, eq, inArray} from "drizzle-orm"
import {getCategoryIds} from "@/lib/db-helpers";
import {Gender} from "@/store/useGenderStore";

export async function getBrands({gender, categorySlug}: { gender: Gender, categorySlug: string }) {
    const categoryIds = categorySlug === "new-items"
        ? undefined
        : await getCategoryIds(gender, categorySlug)

    const result = await db.selectDistinct({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
    })
        .from(brand)
        .innerJoin(product, and(
            eq(product.brandId, brand.id),
            eq(product.gender, gender),
            categoryIds ? inArray(product.categoryId, categoryIds) : undefined,
            eq(product.isActive, true),
        ))
        .orderBy(brand.name)

    return result
}

export async function getAllBrands({gender}: { gender: Gender }) {
    return db
        .selectDistinct({id: brand.id, name: brand.name, slug: brand.slug})
        .from(brand)
        .innerJoin(product, and(
            eq(product.brandId, brand.id),
            eq(product.gender, gender),
            eq(product.isActive, true),
        ))
        .orderBy(brand.name)
}