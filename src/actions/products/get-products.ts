"use server"

import {db} from "@/db"
import {product, brand, category, productColor, color, productPattern, pattern, productStyle, style} from "@/db/schema"
import {and, eq, gte, lte, inArray, desc, asc, sql} from "drizzle-orm"
import {getCategoryIds} from "@/lib/db-helpers"
import {Gender} from "@/store/useGenderStore"

interface GetProductsProps {
    gender: Gender
    category?: string
    productIds?: string[]  // ← добавили
    subcategory?: string | string[]
    brand?: string[]
    color?: string
    pattern?: string
    style?: string
    minPrice?: string
    maxPrice?: string
    discount?: string
    sort?: string
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

    // Находим brandId если нужен
    let brandIds: string[] = []
    if (brandSlug) {
        const brandsData = await db.query.brand.findMany({
            where: inArray(brand.slug, brandSlug)
        })
        brandIds = brandsData.map(b => b.id)
    }

    // Находим colorId если нужен
    let colorId: string | undefined
    if (colorName) {
        const colorData = await db.query.color.findFirst({
            where: eq(color.name, colorName)
        })
        colorId = colorData?.id
    }

    // Находим patternId если нужен
    let patternId: string | undefined
    if (patternName) {
        const patternData = await db.query.pattern.findFirst({
            where: eq(pattern.name, patternName)
        })
        patternId = patternData?.id
    }

    // Находим styleId если нужен
    let styleId: string | undefined
    if (styleName) {
        const styleData = await db.query.style.findFirst({
            where: eq(style.name, styleName)
        })
        styleId = styleData?.id
    }

    // Сортировка
    const orderBy = (() => {
        switch (sort) {
            case "price-asc":
                return asc(product.discountPrice)
            case "price-desc":
                return desc(product.discountPrice)
            case "new":
                return desc(product.createdAt)
            case "discount-desc":
                return desc(product.discount)
            default:
                return desc(product.createdAt)
        }
    })()

    // Общие фильтры для обоих запросов
    const commonFilters = [
        eq(product.isActive, true),
        brandIds.length > 0 ? inArray(product.brandId, brandIds) : undefined,
        maxPrice ? lte(sql`CAST(
        ${product.originalPrice}
        AS
        numeric
        )`, maxPrice) : undefined,
        minPrice ? gte(sql`CAST(
        ${product.originalPrice}
        AS
        numeric
        )`, minPrice) : undefined,
        discount ? gte(product.discount, parseInt(discount)) : undefined,
        colorId ? inArray(product.id,
            db.select({id: productColor.productId}).from(productColor).where(eq(productColor.colorId, colorId))
        ) : undefined,
        patternId ? inArray(product.id,
            db.select({id: productPattern.productId}).from(productPattern).where(eq(productPattern.patternId, patternId))
        ) : undefined,
        styleId ? inArray(product.id,
            db.select({id: productStyle.productId}).from(productStyle).where(eq(productStyle.styleId, styleId))
        ) : undefined,
    ]
    let categoryIds: string[] = []

    if (subcategory) {
        const subcategoryArray = Array.isArray(subcategory) ? subcategory : [subcategory]
        const subs = await db.query.category.findMany({
            where: inArray(category.slug, subcategoryArray)
        })

        if (subs.length > 0) {
            const subIds = subs.map(s => s.id)
            const filteredSubIds = subIds.filter(id => !subs.some(s => s.parentId === id))
            const children = await db.query.category.findMany({
                where: inArray(category.parentId, filteredSubIds)
            })
            const childrenParentIds = new Set(children.map(c => c.parentId))
            const leafIds = filteredSubIds.filter(id => !childrenParentIds.has(id))
            const relevantChildIds = children
                .filter(c => filteredSubIds.includes(c.parentId!))
                .map(c => c.id)
            categoryIds = [...leafIds, ...relevantChildIds]
        } else categoryIds = [];

    } else if (categorySlug) {
        categoryIds = await getCategoryIds(gender, categorySlug)

        if (categorySlug === "new-items") {
            const allCategories = await db.query.category.findMany({
                where: eq(category.gender, gender)
            })
            categoryIds = allCategories.map(c => c.id)
        }
    } else {
        const allCategories = await db.query.category.findMany({
            where: eq(category.gender, gender)
        })
        categoryIds = allCategories.map(c => c.id)
    }
    // Если переданы конкретные productIds (для коллекций)
    if (productIds && productIds.length > 0) {
        return db.query.product.findMany({
            where: and(
                inArray(product.id, productIds),
                ...commonFilters,
            ),
            orderBy,
            with: {brand: true, images: true, sizes: true}
        })
    }

    return db.query.product.findMany({
        where: and(
            eq(product.gender, gender),
            inArray(product.categoryId, categoryIds),
            ...commonFilters,
        ),
        orderBy,
        with: {brand: true, images: true, sizes: true}
    })
}