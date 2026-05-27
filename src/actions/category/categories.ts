// src/actions/categories.ts
"use server"

import { db } from "@/db"
import { category } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function getCategoryWithSubs(gender: string, slug: string) {
    return db.query.category.findFirst({
        where: and(
            eq(category.gender, gender),
            eq(category.slug, slug)
        ),
        with: {
            subcategories: {
                orderBy: (cat, { asc }) => [asc(cat.name)],
                with: {
                    subcategories: true // третий уровень
                }
            }
        }
    })
}