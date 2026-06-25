"use server"

import {db} from "@/db"
import {brand, product} from "@/db/schema"
import {and, eq, inArray, max} from "drizzle-orm"
import {getCategoryIds} from "@/lib/db-helpers";
import {FilterProps} from "@/types/filters/filters-props";

export async function getBrands({ gender, categorySlug, productIds }: FilterProps) {
    const categoryIds = !categorySlug || categorySlug === "new-items"
        ? undefined
        : await getCategoryIds(gender, categorySlug)

    const filter =
        productIds
            ? inArray(product.id, productIds)
            : categoryIds
                ? inArray(product.categoryId, categoryIds)
                : undefined;

    const result = await db.select({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        tags: brand.tags,
        description: brand.description,
        promoDetailsText: brand.promoDetailsText,
        imageUrl: brand.imageUrl,
        isActive: brand.isActive,       // ← добавили
        createdAt: brand.createdAt,     // ← добавили
        updatedAt: brand.updatedAt,     // ← добавили
        maxDiscount: max(product.discount),
    })
        .from(brand)
        .innerJoin(product, and(
            eq(product.brandId, brand.id),
            eq(product.gender, gender),
            filter,
            eq(product.isActive, true),
        ))
        .groupBy(
            brand.id,
            brand.name,
            brand.slug,
            brand.tags,
            brand.description,
            brand.promoDetailsText,
            brand.imageUrl,
            brand.isActive,      // ← добавили
            brand.createdAt,     // ← добавили
            brand.updatedAt,     // ← добавили
        )
        .orderBy(brand.name)
    return result
}

export async function getBrand({ slug }: { slug: string }) {
    const brand = await db.query.brand.findFirst({
        where: (brand, { eq }) => eq(brand.slug, slug)
    })
    if (!brand) throw new Error("Brand not found")
    return brand
}

export async function getBrandById(id: string){
    const brand = await db.query.brand.findFirst({
        where: (brand, { eq }) => eq(brand.id, id)
    })

    if (!brand) throw new Error("Brand not found")
    return brand
}