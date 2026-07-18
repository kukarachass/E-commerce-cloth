"use server"

// actions/products/get-products.ts — оригинал + фильтр по size

import { db } from "@/db"
import { product, brand, category, productColor, color, productPattern, pattern, productStyle, style, productSize } from "@/db/schema"
import { and, eq, gte, lte, inArray, desc, asc, sql, gt } from "drizzle-orm"
import { getCategoryIds, collectDescendantIds, type Category } from "@/lib/db-helpers"
import { parseSizeFilter } from "@/lib/size-mapping"
import {Gender} from "@/hooks/useGender";

const PER_PAGE = 24

interface GetProductsProps {
    gender: Gender
    category?: string
    productIds?: string[]
    subcategory?: string | string[]
    brand?: string[]
    color?: string
    pattern?: string
    style?: string
    size?: string           // "EU:38" или "EU:38,INT:M"
    minPrice?: string
    maxPrice?: string
    discount?: string
    sort?: string
    page?: string
}

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
                                      size: sizeParam,
                                      minPrice,
                                      maxPrice,
                                      discount,
                                      sort,
                                      page,
                                  }: GetProductsProps) {

    if (Array.isArray(productIds) && productIds.length === 0) {
        return { products: [], total: 0, page: 1, perPage: PER_PAGE }
    }

    // --- бренды ---
    let brandIds: string[] = []
    if (brandSlug) {
        const brandsData = await db.query.brand.findMany({ where: inArray(brand.slug, brandSlug) })
        brandIds = brandsData.map(b => b.id)
    }

    // --- цвет ---
    let colorId: string | undefined
    if (colorName) {
        const colorData = await db.query.color.findFirst({ where: eq(color.name, colorName) })
        colorId = colorData?.id
    }

    // --- паттерн ---
    let patternId: string | undefined
    if (patternName) {
        const patternData = await db.query.pattern.findFirst({ where: eq(pattern.name, patternName) })
        patternId = patternData?.id
    }

    // --- стиль ---
    let styleId: string | undefined
    if (styleName) {
        const styleData = await db.query.style.findFirst({ where: eq(style.name, styleName) })
        styleId = styleData?.id
    }

    // --- размер ---
    // Формат: "EU:38" или "EU:38,INT:M" (мультивыбор через запятую)
    let sizeProductIds: string[] | undefined
    if (sizeParam) {
        const parts  = sizeParam.split(",").map(s => s.trim()).filter(Boolean)
        const parsed = parts.map(parseSizeFilter).filter(Boolean) as { system: string; size: string }[]

        if (parsed.length > 0) {
            const results = await Promise.all(
                parsed.map(({ system, size }) =>
                    db
                        .selectDistinct({ productId: productSize.productId })
                        .from(productSize)
                        .where(and(
                            eq(productSize.sizeSystem, system as any),
                            eq(productSize.size, size),
                            gt(productSize.stockAmount, 0),
                        ))
                        .then(rows => rows.map(r => r.productId))
                )
            )
            // OR логика: подходит если есть ЛЮБОЙ из выбранных размеров
            sizeProductIds = [...new Set(results.flat())]
        }
    }

    // --- сортировка ---
    const orderBy = (() => {
        switch (sort) {
            case "price-asc":     return asc(product.discountPrice)
            case "price-desc":    return desc(product.discountPrice)
            case "new":           return desc(product.createdAt)
            case "discount-desc": return desc(product.discount)
            default:              return desc(product.createdAt)
        }
    })()

    // --- общие фильтры ---
    const commonFilters = [
        eq(product.isActive, true),
        brandIds.length > 0
            ? inArray(product.brandId, brandIds)
            : undefined,
        maxPrice
            ? lte(sql`CAST(${product.originalPrice} AS numeric)`, maxPrice)
            : undefined,
        minPrice
            ? gte(sql`CAST(${product.originalPrice} AS numeric)`, minPrice)
            : undefined,
        discount
            ? gte(product.discount, parseInt(discount))
            : undefined,
        colorId
            ? inArray(product.id,
                db.select({ id: productColor.productId }).from(productColor).where(eq(productColor.colorId, colorId))
            )
            : undefined,
        patternId
            ? inArray(product.id,
                db.select({ id: productPattern.productId }).from(productPattern).where(eq(productPattern.patternId, patternId))
            )
            : undefined,
        styleId
            ? inArray(product.id,
                db.select({ id: productStyle.productId }).from(productStyle).where(eq(productStyle.styleId, styleId))
            )
            : undefined,
        sizeProductIds !== undefined
            ? sizeProductIds.length > 0
                ? inArray(product.id, sizeProductIds)
                : eq(product.id, "00000000-0000-0000-0000-000000000000") // размер выбран но ничего нет
            : undefined,
    ]

    // --- категории ---
    let categoryIds: string[] = []

    if (subcategory) {
        const subcategoryArray = Array.isArray(subcategory) ? subcategory : [subcategory]
        const all  = await db.query.category.findMany({ where: eq(category.gender, gender) })
        const byId = new Map(all.map(c => [c.id, c]))
        const selected = all.filter(c => subcategoryArray.includes(c.slug))

        const selectedIds  = new Set(selected.map(c => c.id))
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

    // --- пагинация: валидация страницы и offset ---
    const currentPage = Math.max(1, Number(page) || 1) // клампим мусор: -5, abc, undefined → 1
    const offset = (currentPage - 1) * PER_PAGE

    // --- коллекции ---
    if (productIds && productIds.length > 0) {
        const whereClause = and(inArray(product.id, productIds), ...commonFilters)

        const [products, [{ total }]] = await Promise.all([
            db.query.product.findMany({
                where: whereClause,
                orderBy,
                limit: PER_PAGE,
                offset,
                with: { brand: true, images: true, sizes: true },
            }),
            db.select({ total: sql<number>`count(*)::int` }).from(product).where(whereClause),
        ])

        return { products, total, page: currentPage, perPage: PER_PAGE }
    }

    // --- обычный каталог ---
    const whereClause = and(
        eq(product.gender, gender),
        inArray(product.categoryId, categoryIds),
        ...commonFilters,
    )

    const [products, [{ total }]] = await Promise.all([
        db.query.product.findMany({
            where: whereClause,
            orderBy,
            limit: PER_PAGE,
            offset,
            with: { brand: true, images: true, sizes: true },
        }),
        db.select({ total: sql<number>`count(*)::int` }).from(product).where(whereClause),
    ])

    const totalPages = Math.ceil(total / PER_PAGE)


    return { products, total, page: currentPage, perPage: PER_PAGE, totalPages}
}