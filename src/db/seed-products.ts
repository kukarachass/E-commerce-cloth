import { config } from "dotenv"
config({ path: ".env" })

import { db } from "@/db/seed-client"
import { color, pattern, style, product, productSize, productColor, productPattern, productStyle, productImage, brand, category } from "@/db/schema"

// ============================================================
// Генератор товаров.
// ПРИНЦИП: товар привязан ТОЛЬКО к листу дерева (категория без потомков).
// Родительские страницы собирают эти товары рекурсивно (collectDescendantIds).
// На каждый лист — 3 детерминированных товара.
// ============================================================

const colours = [
    { name: "Beige", hex: "#F5F0E8" }, { name: "Black", hex: "#000000" }, { name: "Blue", hex: "#4A7FD4" },
    { name: "Brown", hex: "#8B5E3C" }, { name: "Gold", hex: "#D4A843" }, { name: "Green", hex: "#4CAF82" },
    { name: "Grey", hex: "#B0B0B0" }, { name: "Multicolour", hex: "#FF6B6B" }, { name: "Orange", hex: "#FF9500" },
    { name: "Pink", hex: "#FFB3BA" }, { name: "Purple", hex: "#9B6DD4" }, { name: "Red", hex: "#E84343" },
    { name: "Silver", hex: "#C0C0C0" }, { name: "White", hex: "#FFFFFF" }, { name: "Yellow", hex: "#FFD43B" },
]
const patterns = ["Animal", "Camouflage", "Floral", "Geometric", "Paisley", "Polka Dot", "Striped", "Plaid", "Solid"]
const styles = ["Business", "Casual", "Elegant", "Minimalism", "Evening"]

// бренды должны уже существовать в БД (их сид отдельный) — используем их slug'и
const BRAND_SLUGS = [
    "tommy-hilfiger", "calvin-klein", "levis", "hugo-boss", "scotch-and-soda", "guess",
    "adidas", "nike", "puma", "lacoste", "g-star-raw", "replay", "the-north-face", "vans", "new-balance",
]

const VARIANTS = ["Classic", "Premium", "Essential"]
const PRICE_TABLE = [
    { originalPrice: "129.00", discountPrice: "51.00", discount: 60 },
    { originalPrice: "199.00", discountPrice: "79.00", discount: 60 },
    { originalPrice: "89.00", discountPrice: "35.00", discount: 61 },
]
const COLOR_POOL = ["Black", "White", "Beige", "Blue", "Grey", "Brown", "Pink", "Green"]
const STYLE_POOL = ["Casual", "Elegant", "Business", "Minimalism"]

const SIZE_CLOTHING = ["XS", "S", "M", "L", "XL"]
const SIZE_SHOES = ["36", "37", "38", "39", "40", "41", "42"]
const SIZE_ONE = ["One Size"]

function sizeSetFor(slug: string): string[] {
    if (slug.includes("shoes")) return SIZE_SHOES          // women-shoes-*, *-sports-shoes
    if (slug.includes("accessories")) return SIZE_ONE      // women-accessories-*, *-sports-accessories
    return SIZE_CLOTHING
}

async function seedRefs() {
    await db.insert(color).values(colours).onConflictDoNothing()
    await db.insert(pattern).values(patterns.map(name => ({ name }))).onConflictDoNothing()
    await db.insert(style).values(styles.map(name => ({ name }))).onConflictDoNothing()
    console.log("✓ refs (colors/patterns/styles) seeded")
}

async function seedProducts() {
    console.log("Seeding products on leaf categories...")

    const brands = await db.select().from(brand)
    const allCategories = await db.select().from(category)
    const colors = await db.select().from(color)
    const pats = await db.select().from(pattern)
    const stys = await db.select().from(style)

    const brandMap = new Map(brands.map(b => [b.slug, b.id]))
    const colorMap = new Map(colors.map(c => [c.name, c.id]))
    const patternMap = new Map(pats.map(p => [p.name, p.id]))
    const styleMap = new Map(stys.map(s => [s.name, s.id]))

    // лист = категория, у которой нет ни одного ребёнка
    const parentIds = new Set(allCategories.map(c => c.parentId).filter(Boolean) as string[])
    const leaves = allCategories.filter(c => !parentIds.has(c.id))

    let productCount = 0
    let brandIdx = 0

    for (const leaf of leaves) {
        const sizes = sizeSetFor(leaf.slug)
        const genderLabel = leaf.gender === "men" ? "Men" : "Women"

        for (let i = 0; i < 3; i++) {
            const brandSlug = BRAND_SLUGS[brandIdx % BRAND_SLUGS.length]
            brandIdx++
            const brandId = brandMap.get(brandSlug)
            if (!brandId) continue

            const price = PRICE_TABLE[i % PRICE_TABLE.length]
            const name = `${VARIANTS[i]} ${leaf.name} ${genderLabel}`
            const slug = `${leaf.slug}-${i + 1}` // уникален, т.к. leaf.slug уникален

            const [created] = await db.insert(product).values({
                name,
                slug,
                shortDescription: `${name} — premium quality ${leaf.gender}'s fashion.`,
                originalPrice: price.originalPrice,
                discountPrice: price.discountPrice,
                discount: price.discount,
                material: "Cotton Blend",
                gender: leaf.gender,
                brandId,
                categoryId: leaf.id,
                isActive: true,
            }).onConflictDoNothing().returning()

            if (!created) continue

            // размеры
            for (const size of sizes) {
                await db.insert(productSize).values({ productId: created.id, size, stockAmount: 5 }).onConflictDoNothing()
            }

            // 2 цвета (ротация по индексу)
            const productColors = [COLOR_POOL[i % COLOR_POOL.length], COLOR_POOL[(i + 3) % COLOR_POOL.length]]
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

            // 1 главное изображение (плейсхолдер, детерминированный по slug)
            await db.insert(productImage).values({
                productId: created.id,
                url: `https://picsum.photos/seed/${slug}/600/800`,
                isMain: true,
                order: 0,
            }).onConflictDoNothing()

            productCount++
        }
    }

    console.log(`✓ ${productCount} products seeded across ${leaves.length} leaf categories`)
}

async function main() {
    try {
        await seedRefs()
        await seedProducts()
        console.log("\n✅ Products seed completed")
    } catch (error) {
        console.error("❌ Seed failed:", error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

main()