// src/actions/categories.ts
"use server"

import {db} from "@/db"
import {category} from "@/db/schema"
import {eq, and, isNull} from "drizzle-orm"

export async function getCategoryWithSubs(gender: string, slug: string) {
    if (slug === `${gender}-new-items`) {
        const allCategories = await db.query.category.findMany({
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