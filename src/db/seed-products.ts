// db/seeds/seed-products.ts

import { config } from "dotenv"
config({ path: ".env" })

import { db } from "@/db/seed-client"
import {
    color, pattern, style,
    product, productSize, productColor, productPattern, productStyle, productImage,
    brand, category,
} from "@/db/schema"

// ─── Справочники ─────────────────────────────────────────────────────────────

const colours = [
    { name: "Beige", hex: "#F5F0E8" }, { name: "Black", hex: "#000000" },
    { name: "Blue", hex: "#4A7FD4" }, { name: "Brown", hex: "#8B5E3C" },
    { name: "Gold", hex: "#D4A843" }, { name: "Green", hex: "#4CAF82" },
    { name: "Grey", hex: "#B0B0B0" }, { name: "Multicolour", hex: "#FF6B6B" },
    { name: "Orange", hex: "#FF9500" }, { name: "Pink", hex: "#FFB3BA" },
    { name: "Purple", hex: "#9B6DD4" }, { name: "Red", hex: "#E84343" },
    { name: "Silver", hex: "#C0C0C0" }, { name: "White", hex: "#FFFFFF" },
    { name: "Yellow", hex: "#FFD43B" },
]
const patterns = ["Animal", "Camouflage", "Floral", "Geometric", "Paisley", "Polka Dot", "Striped", "Plaid", "Solid"]
const styles   = ["Business", "Casual", "Elegant", "Minimalism", "Evening"]

const BRAND_SLUGS = [
    "tommy-hilfiger", "calvin-klein", "levis", "hugo-boss", "scotch-and-soda", "guess",
    "adidas", "nike", "puma", "lacoste", "g-star-raw", "replay", "the-north-face", "vans", "new-balance",
]
const VARIANTS    = ["Classic", "Premium", "Essential"]
const PRICE_TABLE = [
    { originalPrice: "129.00", discountPrice: "51.00", discount: 60 },
    { originalPrice: "199.00", discountPrice: "79.00", discount: 60 },
    { originalPrice: "89.00",  discountPrice: "35.00", discount: 61 },
]
const COLOR_POOL = ["Black", "White", "Beige", "Blue", "Grey", "Brown", "Pink", "Green"]
const STYLE_POOL = ["Casual", "Elegant", "Business", "Minimalism"]

// ─── Размеры: только реалистичные наборы ─────────────────────────────────────
// Каждый продукт получит один из этих наборов (ротация по индексу).
// Одежда — только INT система (то что реально видит покупатель).
// Джинсы/брюки — Waist/Length формат.
// Обувь — EU система.
// Аксессуары — один размер OS.

const CLOTHING_SIZE_POOLS = [
    ["XS", "S", "M"],
    ["S", "M", "L"],
    ["M", "L", "XL"],
    ["XS", "S", "M", "L"],
    ["S", "M", "L", "XL"],
    ["XS", "S"],
    ["L", "XL", "XXL"],
    ["M", "L"],
]

const JEANS_SIZE_POOLS = [
    ["W26L30", "W27L30", "W28L30", "W29L30"],
    ["W28L32", "W29L32", "W30L32", "W31L32"],
    ["W27L28", "W28L28", "W29L28"],
    ["W30L30", "W31L30", "W32L30"],
    ["W26L32", "W27L32", "W28L32"],
    ["W29L30", "W30L30", "W31L30", "W32L30"],
    ["W27L30", "W28L30", "W29L30", "W30L30"],
    ["W28L30", "W29L30"],
]

const SHOE_SIZE_POOLS = [
    ["36", "37", "38"],
    ["37", "38", "39", "40"],
    ["38", "39", "40", "41"],
    ["39", "40", "41", "42"],
    ["36", "37"],
    ["40", "41", "42"],
    ["37", "38", "39"],
    ["38", "39"],
]

const ACCESSORY_SIZES = [["OS"]]

// Ключевые слова для определения типа категории
const SHOE_KEYWORDS        = ["shoes", "sneakers", "boots", "sandals", "heels", "loafers", "flats", "pumps", "slippers", "mules"]
const ACCESSORY_KEYWORDS   = ["accessories", "bags", "bag", "belts", "belt", "scarves", "scarf", "hats", "hat", "cap", "sunglasses", "jewellery", "jewelry", "watches", "watch", "gloves", "socks", "tights"]
const JEANS_KEYWORDS       = ["jeans", "trousers", "pants", "denim", "chinos", "shorts"]

function getCategoryType(slug: string): "shoes" | "accessories" | "jeans" | "clothing" {
    const s = slug.toLowerCase()
    if (SHOE_KEYWORDS.some(kw => s.includes(kw)))      return "shoes"
    if (ACCESSORY_KEYWORDS.some(kw => s.includes(kw))) return "accessories"
    if (JEANS_KEYWORDS.some(kw => s.includes(kw)))     return "jeans"
    return "clothing"
}

// Возвращает набор строк { size, sizeSystem } для одного продукта
function pickSizes(categorySlug: string, productIndex: number): { size: string; sizeSystem: string }[] {
    const type = getCategoryType(categorySlug)

    switch (type) {
        case "shoes": {
            const pool = SHOE_SIZE_POOLS[productIndex % SHOE_SIZE_POOLS.length]
            return pool.map(size => ({ size, sizeSystem: "EU" }))
        }
        case "accessories": {
            return [{ size: "OS", sizeSystem: "INT" }]
        }
        case "jeans": {
            const pool = JEANS_SIZE_POOLS[productIndex % JEANS_SIZE_POOLS.length]
            return pool.map(size => ({ size, sizeSystem: "Waist/Length" }))
        }
        case "clothing":
        default: {
            const pool = CLOTHING_SIZE_POOLS[productIndex % CLOTHING_SIZE_POOLS.length]
            return pool.map(size => ({ size, sizeSystem: "INT" }))
        }
    }
}

// ─── Seed функции ─────────────────────────────────────────────────────────────

async function seedRefs() {
    await db.insert(color).values(colours).onConflictDoNothing()
    await db.insert(pattern).values(patterns.map(name => ({ name }))).onConflictDoNothing()
    await db.insert(style).values(styles.map(name => ({ name }))).onConflictDoNothing()
    console.log("✓ refs seeded")
}

async function seedProducts() {
    console.log("Seeding products…")

    const brands        = await db.select().from(brand)
    const allCategories = await db.select().from(category)
    const colors        = await db.select().from(color)
    const pats          = await db.select().from(pattern)
    const stys          = await db.select().from(style)

    const brandMap   = new Map(brands.map(b => [b.slug, b.id]))
    const colorMap   = new Map(colors.map(c => [c.name, c.id]))
    const patternMap = new Map(pats.map(p => [p.name, p.id]))
    const styleMap   = new Map(stys.map(s => [s.name, s.id]))

    const parentIds = new Set(allCategories.map(c => c.parentId).filter(Boolean) as string[])
    const leaves    = allCategories.filter(c => !parentIds.has(c.id))

    let productCount = 0
    let brandIdx     = 0
    let globalIndex  = 0  // для ротации пулов размеров

    for (const leaf of leaves) {
        const genderLabel = leaf.gender === "men" ? "Men" : "Women"

        for (let i = 0; i < 3; i++) {
            const brandSlug = BRAND_SLUGS[brandIdx % BRAND_SLUGS.length]
            brandIdx++

            const brandId = brandMap.get(brandSlug)
            if (!brandId) continue

            const price = PRICE_TABLE[i % PRICE_TABLE.length]
            const name  = `${VARIANTS[i]} ${leaf.name} ${genderLabel}`
            const slug  = `${leaf.slug}-${i + 1}`

            const [created] = await db
                .insert(product)
                .values({
                    name,
                    slug,
                    shortDescription: `${name} — premium quality ${leaf.gender}'s fashion.`,
                    originalPrice:    price.originalPrice,
                    discountPrice:    price.discountPrice,
                    discount:         price.discount,
                    material:         "Cotton Blend",
                    gender:           leaf.gender,
                    brandId,
                    categoryId:       leaf.id,
                    isActive:         true,
                })
                .onConflictDoNothing()
                .returning()

            if (!created) continue

            // Реалистичный набор размеров — только то что есть "в наличии"
            const sizeRows = pickSizes(leaf.slug, globalIndex).map(({ size, sizeSystem }) => ({
                productId:   created.id,
                size,
                sizeSystem:  sizeSystem as any,
                stockAmount: Math.floor(Math.random() * 5) + 1, // 1–5 штук
            }))

            if (sizeRows.length > 0) {
                await db.insert(productSize).values(sizeRows).onConflictDoNothing()
            }

            globalIndex++

            // 2 цвета
            const productColors = [
                COLOR_POOL[i % COLOR_POOL.length],
                COLOR_POOL[(i + 3) % COLOR_POOL.length],
            ]
            for (const cName of productColors) {
                const colorId = colorMap.get(cName)
                if (colorId) await db.insert(productColor).values({ productId: created.id, colorId }).onConflictDoNothing()
            }

            // паттерн
            const solidId = patternMap.get("Solid")
            if (solidId) await db.insert(productPattern).values({ productId: created.id, patternId: solidId }).onConflictDoNothing()

            // стиль
            const styleId = styleMap.get(STYLE_POOL[i % STYLE_POOL.length])
            if (styleId) await db.insert(productStyle).values({ productId: created.id, styleId }).onConflictDoNothing()

            // изображение
            await db
                .insert(productImage)
                .values({ productId: created.id, url: `https://picsum.photos/seed/${slug}/600/800`, isMain: true, order: 0 })
                .onConflictDoNothing()

            productCount++
        }
    }

    console.log(`✓ ${productCount} products across ${leaves.length} leaf categories`)
}

async function main() {
    try {
        await seedRefs()
        await seedProducts()
        console.log("\n✅ Done")
    } catch (error) {
        console.error("❌ Failed:", error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

main()