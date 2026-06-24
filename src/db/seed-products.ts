// db/seeds/seed-products.ts

import { config } from "dotenv"
config({ path: ".env" })

import { db } from "@/db/seed-client"
import {
    color, pattern, style,
    product, productSize, productColor, productPattern, productStyle, productImage,
    brand, category,
} from "@/db/schema"
import {seedProductNames} from "@/db/seedProductNames";

// 📦 Предполагается, что массив из предыдущего ответа лежит в этом файле:

// ─── Утилиты ─────────────────────────────────────────────────────────────────

const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

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

const PRICE_TABLE = [
    { originalPrice: "129.00", discountPrice: "51.00", discount: 60 },
    { originalPrice: "199.00", discountPrice: "79.00", discount: 60 },
    { originalPrice: "89.00",  discountPrice: "35.00", discount: 61 },
    { originalPrice: "249.00", discountPrice: "149.00", discount: 40 },
    { originalPrice: "59.00",  discountPrice: "59.00", discount: 0 },
]

const COLOR_POOL = ["Black", "White", "Beige", "Blue", "Grey", "Brown", "Pink", "Green"]
const STYLE_POOL = ["Casual", "Elegant", "Business", "Minimalism"]

// ─── Размеры: только реалистичные наборы ─────────────────────────────────────

const CLOTHING_SIZE_POOLS = [
    ["XS", "S", "M"], ["S", "M", "L"], ["M", "L", "XL"],
    ["XS", "S", "M", "L"], ["S", "M", "L", "XL"], ["XS", "S"],
    ["L", "XL", "XXL"], ["M", "L"],
]

const JEANS_SIZE_POOLS = [
    ["W26L30", "W27L30", "W28L30", "W29L30"], ["W28L32", "W29L32", "W30L32", "W31L32"],
    ["W27L28", "W28L28", "W29L28"], ["W30L30", "W31L30", "W32L30"],
    ["W26L32", "W27L32", "W28L32"], ["W29L30", "W30L30", "W31L30", "W32L30"],
    ["W27L30", "W28L30", "W29L30", "W30L30"], ["W28L30", "W29L30"],
]

const SHOE_SIZE_POOLS = [
    ["36", "37", "38"], ["37", "38", "39", "40"], ["38", "39", "40", "41"],
    ["39", "40", "41", "42"], ["36", "37"], ["40", "41", "42"],
    ["37", "38", "39"], ["38", "39"],
]

const ACCESSORY_SIZES = [["OS"]]

const SHOE_KEYWORDS        = ["shoes", "sneakers", "boots", "sandals", "heels", "loafers", "flats", "pumps", "slippers", "mules", "cleats"]
const ACCESSORY_KEYWORDS   = ["accessories", "bag", "bags", "belt", "belts", "scarf", "scarves", "hat", "hats", "cap", "sunglasses", "jewellery", "watch", "watches", "gloves", "socks", "beanie", "wallet"]
const JEANS_KEYWORDS       = ["jeans", "trousers", "pants", "denim", "chinos", "shorts", "joggers", "leggings"]

function getCategoryType(slugOrName: string): "shoes" | "accessories" | "jeans" | "clothing" {
    const s = slugOrName.toLowerCase()
    if (SHOE_KEYWORDS.some(kw => s.includes(kw)))      return "shoes"
    if (ACCESSORY_KEYWORDS.some(kw => s.includes(kw))) return "accessories"
    if (JEANS_KEYWORDS.some(kw => s.includes(kw)))     return "jeans"
    return "clothing"
}

function pickSizes(productName: string, productIndex: number): { size: string; sizeSystem: string }[] {
    const type = getCategoryType(productName)

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

// Умный поиск подходящей категории для товара
function findBestCategory(productName: string, availableLeaves: typeof category.$inferSelect[]) {
    const nameLower = productName.toLowerCase()
    const productType = getCategoryType(productName)

    const exactMatch = availableLeaves.find(c => {
        const catName = c.name.toLowerCase()
        return nameLower.includes(catName) || catName.includes(nameLower.split(' ').pop() || '')
    })
    if (exactMatch) return exactMatch

    // фолбек — но только среди категорий того же типа (обувь к обуви, а не к ремням)
    const sameTypeLeaves = availableLeaves.filter(c => getCategoryType(c.slug) === productType)
    const pool = sameTypeLeaves.length > 0 ? sameTypeLeaves : availableLeaves

    return pool[Math.floor(Math.random() * pool.length)]
}

// ─── Seed функции ─────────────────────────────────────────────────────────────

async function seedRefs() {
    await db.insert(color).values(colours).onConflictDoNothing()
    await db.insert(pattern).values(patterns.map(name => ({ name }))).onConflictDoNothing()
    await db.insert(style).values(styles.map(name => ({ name }))).onConflictDoNothing()
    console.log("✓ refs seeded")
}

async function seedProducts() {
    console.log(`Seeding ${seedProductNames.length} products…`)

    const brands        = await db.select().from(brand)
    const allCategories = await db.select().from(category)
    const colors        = await db.select().from(color)
    const pats          = await db.select().from(pattern)
    const stys          = await db.select().from(style)

    // Собираем Map для быстрого поиска ID по слагу бренда
    const brandMap = new Map(brands.map(b => [b.name.toLowerCase().trim(), b.id]))
    const colorMap   = new Map(colors.map(c => [c.name, c.id]))
    const patternMap = new Map(pats.map(p => [p.name, p.id]))
    const styleMap   = new Map(stys.map(s => [s.name, s.id]))

    const parentIds = new Set(allCategories.map(c => c.parentId).filter(Boolean) as string[])
    const leaves    = allCategories.filter(c => !parentIds.has(c.id))

    const menLeaves = leaves.filter(c => c.gender === "men")
    const womenLeaves = leaves.filter(c => c.gender === "women")

    let productCount = 0

    for (let i = 0; i < seedProductNames.length; i++) {
        const prodData = seedProductNames[i]

        // Находим бренд
        const brandId = brandMap.get(prodData.brand.toLowerCase().trim())

        if (!brandId) {
            console.warn(`⚠️ Brand not found in DB: ${prodData.brand}`)
            continue
        }

        // Подбираем категорию
        const genderLeaves = prodData.gender === "men" ? menLeaves : womenLeaves
        if (genderLeaves.length === 0) continue

        const targetCategory = findBestCategory(prodData.name, genderLeaves)

        const price = PRICE_TABLE[i % PRICE_TABLE.length]
        const slug  = `${slugify(prodData.brand)}-${slugify(prodData.name)}-${i}`

        const [created] = await db
            .insert(product)
            .values({
                name:             prodData.name,
                slug:             slug,
                shortDescription: `${prodData.name} by ${prodData.brand} — premium quality ${prodData.gender}'s fashion.`,
                originalPrice:    price.originalPrice,
                discountPrice:    price.discountPrice,
                discount:         price.discount,
                material:         "Cotton Blend", // Можно рандомизировать при желании
                gender:           prodData.gender,
                brandId:          brandId,
                categoryId:       targetCategory.id,
                isActive:         true,
            })
            .onConflictDoNothing()
            .returning()

        if (!created) continue

        // Размеры
        const sizeRows = pickSizes(prodData.name, i).map(({ size, sizeSystem }) => ({
            productId:   created.id,
            size,
            sizeSystem:  sizeSystem as any,
            stockAmount: Math.floor(Math.random() * 5) + 1, // 1–5 штук
        }))

        if (sizeRows.length > 0) {
            await db.insert(productSize).values(sizeRows).onConflictDoNothing()
        }

        // Цвета (по 2 на товар)
        const productColors = [
            COLOR_POOL[i % COLOR_POOL.length],
            COLOR_POOL[(i + 3) % COLOR_POOL.length],
        ]
        for (const cName of productColors) {
            const colorId = colorMap.get(cName)
            if (colorId) {
                await db.insert(productColor).values({ productId: created.id, colorId }).onConflictDoNothing()
            }
        }

        // Паттерн (базово Solid)
        const solidId = patternMap.get("Solid")
        if (solidId) {
            await db.insert(productPattern).values({ productId: created.id, patternId: solidId }).onConflictDoNothing()
        }

        // Стиль
        const styleId = styleMap.get(STYLE_POOL[i % STYLE_POOL.length])
        if (styleId) {
            await db.insert(productStyle).values({ productId: created.id, styleId }).onConflictDoNothing()
        }

        // Изображение
        await db
            .insert(productImage)
            .values({ productId: created.id, url: `https://picsum.photos/seed/${slug}/600/800`, isMain: true, order: 0 })
            .onConflictDoNothing()

        productCount++
    }

    console.log(`✓ ${productCount} products seeded successfully!`)
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