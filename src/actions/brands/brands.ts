"use server"

import {db} from "@/db"
import {brand, product, productSize} from "@/db/schema"
import {and, eq, inArray, max} from "drizzle-orm"
import {getCategoryIds} from "@/lib/db-helpers";
import {Gender} from "@/store/useGenderStore";
import {FilterProps} from "@/types/filters/filters-props";

export async function getBrands({ gender, categorySlug, productIds }: FilterProps) {
    const categoryIds = !categorySlug || categorySlug === "new-items"
        ? undefined
        : await getCategoryIds(gender, categorySlug)

    const filter =
        productIds ?
            inArray(product.id, productIds) :
            categoryIds
                ? inArray(product.categoryId, categoryIds)
                : undefined;

    const result = await db.select({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        tags: brand.tags,
        maxDiscount: max(product.discount),
    })
        .from(brand)
        .innerJoin(product, and(
            eq(product.brandId, brand.id),
            eq(product.gender, gender),
            filter,
            eq(product.isActive, true),
        ))
        .groupBy(brand.id, brand.name, brand.slug, brand.logo, brand.tags)
        .orderBy(brand.name)

    return result
}

export async function getAllBrands({gender}: { gender: Gender }) {
    return db
        .select({
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            logo: brand.logo,
            tags: brand.tags,
            maxDiscount: max(product.discount),
        })
        .from(brand)
        .innerJoin(product, and(
            eq(product.brandId, brand.id),
            eq(product.gender, gender),
            eq(product.isActive, true),
        ))
        .groupBy(brand.id, brand.name, brand.slug, brand.logo, brand.tags)
        .orderBy(brand.name)}

