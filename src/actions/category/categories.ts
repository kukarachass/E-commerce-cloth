// src/actions/categories.ts
"use server"

import {db} from "@/db"
import {category} from "@/db/schema"
import {eq, and, isNull} from "drizzle-orm"
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