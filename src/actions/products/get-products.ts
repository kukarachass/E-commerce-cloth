"use server"

import { db } from "@/db"
import { product, brand, category, productColor, color, productPattern, pattern, productStyle, style } from "@/db/schema"
import { and, eq, gte, lte, inArray, desc, asc, SQL } from "drizzle-orm"

interface GetProductsProps {
    gender: string
    category: string
    subcategory?: string
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

    // Находим категорию
    const categoryData = await db.query.category.findFirst({
        where: eq(category.slug, `${gender}-${categorySlug}`)
    })
    if (!categoryData) return []

    // Собираем categoryIds
    const subcategories = await db.query.category.findMany({
        where: eq(category.parentId, categoryData.id)
    })

    let categoryIds = [categoryData.id, ...subcategories.map(s => s.id)]

    if (subcategory) {
        const sub = await db.query.category.findFirst({
            where: eq(category.slug, `${gender}-${categorySlug}-${subcategory}`)
        })
        if (sub) categoryIds = [sub.id]
    }

    // Находим brandId если нужен
    let brandIds: string[] = []
    if (brandSlug) {
        const brandsData = await db.query.brand.findMany({
            where: inArray(brand.slug, brandSlug)
        })
        brandIds = brandsData.map(b => b.id);
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
            case "price-asc": return asc(product.discountPrice)
            case "price-desc": return desc(product.discountPrice)
            case "new": return desc(product.createdAt)
            case "discount-desc": return desc(product.discount)
            default: return desc(product.createdAt)
        }
    })()

    // Финальный запрос
    return db.query.product.findMany({
        where: and(
            eq(product.gender, gender),
            eq(product.isActive, true),
            inArray(product.categoryId, categoryIds),
            brandIds && brandIds.length > 0 ? inArray(product.brandId, brandIds) : undefined,
            minPrice ? gte(product.discountPrice, minPrice) : undefined,
            maxPrice ? lte(product.discountPrice, maxPrice) : undefined,
            discount ? gte(product.discount, parseInt(discount)) : undefined,
            colorId ? inArray(product.id,
                db.select({ id: productColor.productId })
                    .from(productColor)
                    .where(eq(productColor.colorId, colorId))
            ) : undefined,
            patternId ? inArray(product.id,
                db.select({ id: productPattern.productId })
                    .from(productPattern)
                    .where(eq(productPattern.patternId, patternId))
            ) : undefined,
            styleId ? inArray(product.id,
                db.select({ id: productStyle.productId })
                    .from(productStyle)
                    .where(eq(productStyle.styleId, styleId))
            ) : undefined,
        ),
        orderBy,
        with: {
            brand: true,
            images: true,
            sizes: true,
        }
    })
}