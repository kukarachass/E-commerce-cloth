"use server"

import { db } from "@/db"
import { product, brand, category, productColor, color, productPattern, pattern, productStyle, style } from "@/db/schema"
import { and, eq, gte, lte, inArray, desc, asc, sql } from "drizzle-orm"
import { getCategoryIds, collectDescendantIds, type Category } from "@/lib/db-helpers"
import { Gender } from "@/store/useGenderStore"

interface GetProductsProps {
    gender: Gender
    category?: string          // slug-хвост без gender: "clothing" | "clothing-coats" | "clothing-coats-parkas"
    productIds?: string[]      // для коллекций
    subcategory?: string | string[] // ПОЛНЫЕ slug'и категорий из сайдбара
    brand?: string[]
    color?: string
    pattern?: string
    style?: string
    minPrice?: string
    maxPrice?: string
    discount?: string
    sort?: string
}

// drill-down: узел остаётся, только если среди выбранных нет его ПОТОМКА.
// Выбрал Jackets + Bomber → Jackets выкидываем (он предок выбранного Bomber).
// Выбрал Bomber + Blazers (соседи) → оба остаются.
function isAncestorOfSelected(nodeId: string, selectedIds: Set<string>, byId: Map<string, Category>): boolean {
    for (const sid of selectedIds) {
        if (sid === nodeId) continue
        let cur = byId.get(sid)
        while (cur?.parentId) {
            if (cur.parentId === nodeId) return true
            cur = byId.get(cur.parentId)
        }
    }
    return false
}

export async function getProducts({
                                      gender,
                                      category: categorySlug,
                                      productIds,
                                      subcategory,
                                      brand: brandSlug,
                                      color: colorName,
                                      pattern: patternName,
                                      style: styleName,
                                      minPrice,
                                      maxPrice,
                                      discount,
                                      sort,
                                  }: GetProductsProps) {

    // --- резолв id'шников фильтров ---
    let brandIds: string[] = []
    if (brandSlug) {
        const brandsData = await db.query.brand.findMany({ where: inArray(brand.slug, brandSlug) })
        brandIds = brandsData.map(b => b.id)
    }

    let colorId: string | undefined
    if (colorName) {
        const colorData = await db.query.color.findFirst({ where: eq(color.name, colorName) })
        colorId = colorData?.id
    }

    let patternId: string | undefined
    if (patternName) {
        const patternData = await db.query.pattern.findFirst({ where: eq(pattern.name, patternName) })
        patternId = patternData?.id
    }

    let styleId: string | undefined
    if (styleName) {
        const styleData = await db.query.style.findFirst({ where: eq(style.name, styleName) })
        styleId = styleData?.id
    }

    // --- сортировка ---
    const orderBy = (() => {
        switch (sort) {
            case "price-asc": return asc(product.discountPrice)
            case "price-desc": return desc(product.discountPrice)
            case "new": return desc(product.createdAt)
            case "discount-desc": return desc(product.discount)
            default: return desc(product.createdAt)
        }
    })()

    // --- общие фильтры ---
    const commonFilters = [
        eq(product.isActive, true),
        brandIds.length > 0 ? inArray(product.brandId, brandIds) : undefined,
        maxPrice ? lte(sql`CAST(${product.originalPrice} AS numeric)`, maxPrice) : undefined,
        minPrice ? gte(sql`CAST(${product.originalPrice} AS numeric)`, minPrice) : undefined,
        discount ? gte(product.discount, parseInt(discount)) : undefined,
        colorId ? inArray(product.id,
            db.select({ id: productColor.productId }).from(productColor).where(eq(productColor.colorId, colorId))
        ) : undefined,
        patternId ? inArray(product.id,
            db.select({ id: productPattern.productId }).from(productPattern).where(eq(productPattern.patternId, patternId))
        ) : undefined,
        styleId ? inArray(product.id,
            db.select({ id: productStyle.productId }).from(productStyle).where(eq(productStyle.styleId, styleId))
        ) : undefined,
    ]

    // --- определяем набор категорий ---
    let categoryIds: string[] = []

    if (subcategory) {
        const subcategoryArray = Array.isArray(subcategory) ? subcategory : [subcategory]
        const all = await db.query.category.findMany({ where: eq(category.gender, gender) })
        const byId = new Map(all.map(c => [c.id, c]))
        const selected = all.filter(c => subcategoryArray.includes(c.slug))

        // оставляем только самые специфичные выбранные узлы (drill-down)
        const selectedIds = new Set(selected.map(c => c.id))
        const mostSpecific = selected.filter(c => !isAncestorOfSelected(c.id, selectedIds, byId))

        categoryIds = mostSpecific.flatMap(c => collectDescendantIds(c.id, all))
    } else if (categorySlug === "new-items") {
        const all = await db.query.category.findMany({ where: eq(category.gender, gender) })
        categoryIds = all.map(c => c.id)
    } else if (categorySlug) {
        categoryIds = await getCategoryIds(gender, categorySlug)
    } else {
        const all = await db.query.category.findMany({ where: eq(category.gender, gender) })
        categoryIds = all.map(c => c.id)
    }

    // --- коллекции: явный список productIds ---
    if (productIds && productIds.length > 0) {
        return db.query.product.findMany({
            where: and(inArray(product.id, productIds), ...commonFilters),
            orderBy,
            with: { brand: true, images: true, sizes: true },
        })
    }

    // categoryIds пуст → inArray вернёт пусто (корректно)
    return db.query.product.findMany({
        where: and(
            eq(product.gender, gender),
            inArray(product.categoryId, categoryIds),
            ...commonFilters,
        ),
        orderBy,
        with: { brand: true, images: true, sizes: true },
    })
}