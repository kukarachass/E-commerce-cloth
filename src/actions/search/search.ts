// actions/search/search.ts
"use server"

import { db } from "@/db"
import { brand, category, collection, collectionProduct, product } from "@/db/schema"
import { and, desc, eq, sql } from "drizzle-orm"
import { buildCategoryHref, type Category } from "@/lib/db-helpers"

const MIN_QUERY_LENGTH = 2
const TRGM_MIN_LENGTH = 3

export type BrandSuggestion = { id: string; name: string; slug: string; sim: number }
export type CategorySuggestion = {
    id: string
    name: string
    slug: string
    sim: number
    level: number
    parentId: string | null
    href: string
}
export type CollectionSuggestion = { id: string; title: string; slug: string; sim: number }

export type ProductResult = {
    id: string
    name: string
    slug: string
    price: string
    imageUrl: string
    brand: string
    discountPrice: string
    originalPrice: string
}

export type SearchResult = {
    brands: BrandSuggestion[]
    categories: CategorySuggestion[]
    collections: CollectionSuggestion[]
    products: ProductResult[]
}

function escapeLike(input: string): string {
    return input.replace(/[\\%_]/g, (ch) => `\\${ch}`)
}

const mainImage = sql<string>`(
    select url from product_image
    where product_id = ${product.id}
    order by is_main desc, "order" asc
    limit 1
)`

const productColumns = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.discountPrice,
    imageUrl: mainImage,
    brand: brand.name,
    discountPrice: product.discountPrice,
    originalPrice: product.originalPrice,
}

function buildPredicate(column: any, query: string, useTrgm: boolean) {
    return useTrgm
        ? sql`${column} % ${query}`
        : sql`${column} ilike ${escapeLike(query) + "%"} escape '\\'`
}

export async function searchCatalog(rawQuery: string, gender: string): Promise<SearchResult> {
    const query = rawQuery.trim()

    if (query.length < MIN_QUERY_LENGTH) {
        return { brands: [], categories: [], collections: [], products: [] }
    }

    const useTrgm = query.length >= TRGM_MIN_LENGTH

    const brandPredicate = buildPredicate(brand.name, query, useTrgm)
    const categoryPredicate = buildPredicate(category.name, query, useTrgm)
    const collectionPredicate = buildPredicate(collection.title, query, useTrgm)
    const productNamePredicate = buildPredicate(product.name, query, useTrgm)

    const productPredicate = sql`(
        ${productNamePredicate}
        or ${brandPredicate}
        or ${categoryPredicate}
        or exists (
            select 1 from ${collectionProduct}
            inner join ${collection} on ${collectionProduct.collectionId} = ${collection.id}
            where ${collectionProduct.productId} = ${product.id}
            and (${collectionPredicate})
        )
    )`

    // ── ИЗМЕНЕНИЕ 1 ──────────────────────────────────────────────
    // Добавили загрузку ВСЕХ категорий (allCats) в тот же Promise.all —
    // она нужна как карта предков для построения href.
    // Переменную матча категорий переименовали в matchedCategories.
    const [brands, matchedCategories, collections, products, allCats] = await Promise.all([
        db
            .select({
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                sim: sql<number>`similarity(${brand.name}, ${query})`,
            })
            .from(brand)
            .where(and(eq(brand.isActive, true), brandPredicate))
            .orderBy(desc(sql`similarity(${brand.name}, ${query})`)),

        db
            .select({
                id: category.id,
                name: category.name,
                slug: category.slug,
                sim: sql<number>`similarity(${category.name}, ${query})`,
                level: category.level,
            })
            .from(category)
            .where(and(eq(category.gender, gender), categoryPredicate))
            .orderBy(desc(sql`similarity(${category.name}, ${query})`)),

        db
            .select({
                id: collection.id,
                title: collection.title,
                slug: collection.slug,
                sim: sql<number>`similarity(${collection.title}, ${query})`,
            })
            .from(collection)
            .where(and(eq(collection.isActive, true), collectionPredicate))
            .orderBy(desc(sql`similarity(${collection.title}, ${query})`)),

        db
            .select(productColumns)
            .from(product)
            .innerJoin(brand, eq(product.brandId, brand.id))
            .innerJoin(category, eq(product.categoryId, category.id))
            .where(and(
                eq(product.isActive, true), productPredicate,
                eq(product.gender, gender),
            ))
            .orderBy(desc(sql`similarity(${product.name}, ${query})`)),

        // карта предков для href — все категории, их немного
        db.select().from(category),
    ])

    // ── ИЗМЕНЕНИЕ 2 ──────────────────────────────────────────────
    // Обогащаем найденные категории: parentId + готовый href.
    // href строим из ПОЛНОЙ категории (с gender/parentId), достаём её из byId по id —
    // потому что matchedCategories содержит только id/name/slug/sim/level.
    const byId = new Map<string, Category>(allCats.map(c => [c.id, c]))

    const categories: CategorySuggestion[] = matchedCategories.map((c) => {
        const full = byId.get(c.id)!
        return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            sim: c.sim,
            level: c.level,
            parentId: full.parentId,
            href: buildCategoryHref(full, byId),
        }
    })

    return { brands, categories, collections, products }
}