// src/lib/db-helpers.ts
import { db } from "@/db"
import { category } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getCategoryIds(gender: string, categorySlug: string): Promise<string[]> {
    const categoryData = await db.query.category.findFirst({
        where: eq(category.slug, `${gender}-${categorySlug}`)
    })
    if (!categoryData) return []

    const subcategories = await db.query.category.findMany({
        where: eq(category.parentId, categoryData.id)
    })

    return [categoryData.id, ...subcategories.map(s => s.id)]
}