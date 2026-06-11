// src/actions/categories.ts
"use server"

import {db} from "@/db"
import {category, product} from "@/db/schema"
import {eq, and, isNull, inArray} from "drizzle-orm"
import {Gender} from "@/store/useGenderStore";

export async function getCategoryWithSubs(gender: Gender, slug: string) {
    if (slug === `${gender}-new-items`) {
        const allCategories = await getAllCategoriesWithSubs({gender})

        return {
            name: "New Items",
            subcategories: allCategories
        }
    } else {
        return db.query.category.findFirst({
            where: and(
                eq(category.gender, gender),
                eq(category.slug, slug)
            ),
            with: {
                subcategories: {
                    orderBy: (cat, {asc}) => [asc(cat.name)],
                    with: {
                        subcategories: true // третий уровень
                    }
                }
            }
        })
    }
}

export async function getAllCategoriesWithSubs({ gender }: { gender: Gender }){
    return await db.query.category.findMany({
        where: and(
            eq(category.gender, gender),
            isNull(category.parentId)
        ),
        orderBy: (cat, { asc }) => [asc(cat.name)],
        with: {
            subcategories: {
                orderBy: (cat, { asc }) => [asc(cat.name)],
                with: { subcategories: true }
            }
        }
    })
}

export async function getCategoriesByProductIds(productIds: string[]) {
    const categories = await db
        .selectDistinct({
            id: category.id,
            name: category.name,
            slug: category.slug,
            gender: category.gender,
            parentId: category.parentId,
            createdAt: category.createdAt,
            image: category.image,
        })
        .from(category)
        .innerJoin(product, eq(product.categoryId, category.id))
        .where(inArray(product.id, productIds))
        .orderBy(category.name)

    return categories
}