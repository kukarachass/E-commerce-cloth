"use server"

import { db } from "@/db"
import { brand, product, category } from "@/db/schema"
import { and, eq, inArray } from "drizzle-orm"

export async function getBrands({ gender, categorySlug }: { gender: string, categorySlug: string }) {

    // Находим категорию и все её подкатегории
    const categoryData = await db.query.category.findFirst({
        where: eq(category.slug, `${gender}-${categorySlug}`)
    })
    if (!categoryData) return []

    const subcategories = await db.query.category.findMany({
        where: eq(category.parentId, categoryData.id)
    })
    const categoryIds = [categoryData.id, ...subcategories.map(s => s.id)]

    // Берём уникальные бренды у которых есть продукты в этой категории
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