// src/actions/category/categories.ts
"use server"

import { db } from "@/db"
import { category, product } from "@/db/schema"
import { eq, and, isNull, inArray } from "drizzle-orm"
import { Gender } from "@/store/useGenderStore"

// Поиск категории страницы по ПОЛНОМУ slug.
// slug уникален, поэтому однозначно идентифицирует строку; gender добавлен
// для соответствия твоему требованию (он теперь notNull) и как доп. защита.
export async function getCategoryWithSubs(gender: Gender, slug: string) {
    if (slug === `${gender}-new-items`) {
        const allCategories = await getAllCategoriesWithSubs({ gender })
        return { name: "New Items", subcategories: allCategories }
    }

    return db.query.category.findFirst({
        where: and(eq(category.gender, gender), eq(category.slug, slug)),
        with: {
            subcategories: {
                orderBy: (cat, { asc }) => [asc(cat.name)],
                with: {
                    subcategories: {
                        orderBy: (cat, { asc }) => [asc(cat.name)],
                    },
                },
            },
        },
    })
}

export async function getAllCategoriesWithSubs({ gender }: { gender: Gender }) {
    return db.query.category.findMany({
        where: and(eq(category.gender, gender), isNull(category.parentId)),
        orderBy: (cat, { asc }) => [asc(cat.name)],
        with: {
            subcategories: {
                orderBy: (cat, { asc }) => [asc(cat.name)],
                with: {
                    subcategories: { orderBy: (cat, { asc }) => [asc(cat.name)] },
                },
            },
        },
    })
}

export async function getCategoriesByProductIds(productIds: string[]) {
    return db
        .selectDistinct({
            id: category.id,
            name: category.name,
            slug: category.slug,
            gender: category.gender,
            parentId: category.parentId,
            createdAt: category.createdAt,
            image: category.image,
            level: category.level,
        })
        .from(category)
        .innerJoin(product, eq(product.categoryId, category.id))
        .where(inArray(product.id, productIds))
        .orderBy(category.name)
}