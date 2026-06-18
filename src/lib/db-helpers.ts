// src/lib/db-helpers.ts
import { db } from "@/db"
import { category } from "@/db/schema"
import { eq, type InferSelectModel } from "drizzle-orm"

export type Category = InferSelectModel<typeof category>

// ============================================================
// id категории + ВСЕХ её потомков на любую глубину.
// Чистый обход по parentId в памяти — категорий мало.
// ============================================================
export function collectDescendantIds(rootId: string, all: Category[]): string[] {
    const childrenByParent = new Map<string, Category[]>()
    for (const c of all) {
        if (!c.parentId) continue
        const arr = childrenByParent.get(c.parentId) ?? []
        arr.push(c)
        childrenByParent.set(c.parentId, arr)
    }

    const ids: string[] = []
    const stack = [rootId]
    while (stack.length) {
        const id = stack.pop()!
        ids.push(id)
        for (const child of childrenByParent.get(id) ?? []) stack.push(child.id)
    }
    return ids
}

// ============================================================
// id категории по её slug-хвосту + все потомки.
// gender теперь notNull → фильтруем по нему сразу (безопасно и быстро).
// ============================================================
export async function getCategoryIds(gender: string, categorySlug: string): Promise<string[]> {
    const all = await db.query.category.findMany({ where: eq(category.gender, gender) })
    const root = all.find(c => c.slug === `${gender}-${categorySlug}`)
    if (!root) return []
    return collectDescendantIds(root.id, all)
}

// ============================================================
// Строит URL /women/clothing/coats/parkas из категории.
// slug полный → собственный сегмент = срез по длине slug родителя (+1 за дефис).
// Срез по префиксу однозначен, дефисы внутри имён не ломаются.
// ============================================================
export function buildCategoryHref(cat: Category, byId: Map<string, Category>): string {
    const segments: string[] = []
    let current: Category | undefined = cat
    while (current) {
        const parent: Category | undefined = current.parentId ? byId.get(current.parentId) : undefined
        const parentSlug = parent ? parent.slug : cat.gender // у корня «родитель» = префикс пола
        segments.unshift(current.slug.slice(parentSlug.length + 1))
        current = parent
    }
    return `/${cat.gender}/${segments.join("/")}`
}