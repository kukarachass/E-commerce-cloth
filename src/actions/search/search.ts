// actions/search/search.ts
"use server"

import { db } from "@/db"
import { brand, category, collection, collectionProduct, product, productImage } from "@/db/schema"
import { and, desc, eq, sql } from "drizzle-orm"

const MIN_QUERY_LENGTH = 2
const TRGM_MIN_LENGTH = 3

export type BrandSuggestion = { id: string; name: string; slug: string; sim: number }
export type CategorySuggestion = { id: string; name: string; slug: string; sim: number }
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

// корреляция по product.id работает только если product уже доступен в скоупе запроса —
// здесь он есть, потому что это подзапрос внутри select от product
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

// общий хелпер predicate под trgm/ilike для text-колонки
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

    // ИСПРАВЛЕНО: у category поле "name", у collection поле "title" — не "name"
    const brandPredicate = buildPredicate(brand.name, query, useTrgm)
    const categoryPredicate = buildPredicate(category.name, query, useTrgm)
    const collectionPredicate = buildPredicate(collection.title, query, useTrgm)
    const productNamePredicate = buildPredicate(product.name, query, useTrgm)

    // matched_collection_ids — subquery, а не JOIN, чтобы не плодить
    // дубли строк товара через many-to-many collectionProduct.
    // "товар матчится, если он лежит хоть в одной коллекции с подходящим title"
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

    const [brands, categories, collections, products] = await Promise.all([
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
            })
            .from(category)
            .where(and(eq(category.gender, gender), categoryPredicate)) // у category нет isActive в схеме — убрал
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

        // category здесь innerJoin, не leftJoin — у product.categoryId notNull в схеме
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
    ])

    return { brands, categories, collections, products }
}