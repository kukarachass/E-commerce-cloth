import { config } from "dotenv"
config({ path: ".env" })

import { db } from "@/db/seed-client"
import { product, productSize, productColor, productPattern, productStyle, brand, category, color, pattern, style } from "@/db/schema"

const jeansSubcategories = [
    // ========================================================
    // WOMEN — JEANS SUBCATEGORIES
    // ========================================================

    // Straight Jeans — women
    { name: "Classic Straight Leg Jeans Women", slug: "classic-straight-leg-jeans-women", brandSlug: "levis", categorySlug: "women-clothing-jeans-straight-jeans", gender: "women", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "100% Cotton Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "25", stock: 4 }, { size: "26", stock: 5 }, { size: "27", stock: 6 }, { size: "28", stock: 4 }, { size: "30", stock: 2 }] },
    { name: "Straight Fit Raw Hem Jeans Women", slug: "straight-fit-raw-hem-jeans-women", brandSlug: "g-star-raw", categorySlug: "women-clothing-jeans-straight-jeans", gender: "women", originalPrice: "149.00", discountPrice: "74.00", discount: 50, material: "Cotton Blend", colors: ["Blue", "Grey"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "25", stock: 3 }, { size: "26", stock: 4 }, { size: "27", stock: 5 }, { size: "28", stock: 3 }] },
    { name: "High Waist Straight Jeans Women", slug: "high-waist-straight-jeans-women", brandSlug: "replay", categorySlug: "women-clothing-jeans-straight-jeans", gender: "women", originalPrice: "159.00", discountPrice: "63.00", discount: 60, material: "Stretch Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "25", stock: 4 }, { size: "26", stock: 5 }, { size: "27", stock: 5 }, { size: "28", stock: 3 }, { size: "30", stock: 2 }] },

    // Skinny Jeans — women
    { name: "Classic Skinny Jeans Women", slug: "classic-skinny-jeans-women", brandSlug: "levis", categorySlug: "women-clothing-jeans-skinny-jeans", gender: "women", originalPrice: "119.00", discountPrice: "47.00", discount: 60, material: "Stretch Denim", colors: ["Blue", "Black", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "25", stock: 5 }, { size: "26", stock: 6 }, { size: "27", stock: 6 }, { size: "28", stock: 4 }, { size: "30", stock: 2 }] },
    { name: "High Rise Skinny Jeans Women", slug: "high-rise-skinny-jeans-women", brandSlug: "g-star-raw", categorySlug: "women-clothing-jeans-skinny-jeans", gender: "women", originalPrice: "139.00", discountPrice: "55.00", discount: 60, material: "98% Cotton 2% Elastane", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "25", stock: 4 }, { size: "26", stock: 5 }, { size: "27", stock: 5 }, { size: "28", stock: 4 }] },
    { name: "Push Up Skinny Jeans Women", slug: "push-up-skinny-jeans-women", brandSlug: "replay", categorySlug: "women-clothing-jeans-skinny-jeans", gender: "women", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Stretch Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "25", stock: 4 }, { size: "26", stock: 5 }, { size: "27", stock: 5 }, { size: "28", stock: 3 }] },

    // Slim Jeans — women
    { name: "Slim Fit Jeans Women", slug: "slim-fit-jeans-women", brandSlug: "levis", categorySlug: "women-clothing-jeans-slim-jeans", gender: "women", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "Cotton Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "25", stock: 4 }, { size: "26", stock: 5 }, { size: "27", stock: 6 }, { size: "28", stock: 4 }, { size: "30", stock: 2 }] },
    { name: "Mid Rise Slim Jeans Women", slug: "mid-rise-slim-jeans-women", brandSlug: "g-star-raw", categorySlug: "women-clothing-jeans-slim-jeans", gender: "women", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Stretch Denim", colors: ["Blue", "Grey"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "25", stock: 3 }, { size: "26", stock: 4 }, { size: "27", stock: 5 }, { size: "28", stock: 3 }] },
    { name: "Slim Ankle Jeans Women", slug: "slim-ankle-jeans-women", brandSlug: "replay", categorySlug: "women-clothing-jeans-slim-jeans", gender: "women", originalPrice: "139.00", discountPrice: "55.00", discount: 60, material: "Cotton Blend", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "25", stock: 4 }, { size: "26", stock: 5 }, { size: "27", stock: 5 }, { size: "28", stock: 3 }] },

    // Flared — women
    { name: "Flared Denim Jeans Women", slug: "flared-denim-jeans-women", brandSlug: "levis", categorySlug: "women-clothing-jeans-flared", gender: "women", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Cotton Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "25", stock: 3 }, { size: "26", stock: 4 }, { size: "27", stock: 5 }, { size: "28", stock: 3 }] },
    { name: "Wide Leg Flared Jeans Women", slug: "wide-leg-flared-jeans-women", brandSlug: "g-star-raw", categorySlug: "women-clothing-jeans-flared", gender: "women", originalPrice: "169.00", discountPrice: "67.00", discount: 60, material: "Stretch Denim", colors: ["Blue", "Grey"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "25", stock: 3 }, { size: "26", stock: 4 }, { size: "27", stock: 4 }, { size: "28", stock: 3 }] },
    { name: "70s Flared Jeans Women", slug: "70s-flared-jeans-women", brandSlug: "replay", categorySlug: "women-clothing-jeans-flared", gender: "women", originalPrice: "159.00", discountPrice: "63.00", discount: 60, material: "Cotton Blend", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "25", stock: 3 }, { size: "26", stock: 4 }, { size: "27", stock: 4 }, { size: "28", stock: 2 }] },

    // ========================================================
    // MEN — JEANS SUBCATEGORIES
    // ========================================================

    // Straight Jeans — men
    { name: "Classic Straight Jeans Men", slug: "classic-straight-jeans-men", brandSlug: "levis", categorySlug: "men-clothing-jeans-straight-jeans", gender: "men", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "100% Cotton Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 4 }, { size: "30", stock: 5 }, { size: "32", stock: 6 }, { size: "34", stock: 4 }, { size: "36", stock: 2 }] },
    { name: "Straight Raw Selvedge Jeans Men", slug: "straight-raw-selvedge-jeans-men", brandSlug: "g-star-raw", categorySlug: "men-clothing-jeans-straight-jeans", gender: "men", originalPrice: "179.00", discountPrice: "89.00", discount: 50, material: "Raw Selvedge Denim", colors: ["Blue"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "28", stock: 3 }, { size: "30", stock: 4 }, { size: "32", stock: 5 }, { size: "34", stock: 3 }] },
    { name: "Relaxed Straight Jeans Men", slug: "relaxed-straight-jeans-men", brandSlug: "replay", categorySlug: "men-clothing-jeans-straight-jeans", gender: "men", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Cotton Blend", colors: ["Blue", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 4 }, { size: "30", stock: 5 }, { size: "32", stock: 5 }, { size: "34", stock: 4 }, { size: "36", stock: 2 }] },

    // Skinny Jeans — men
    { name: "Skinny Fit Jeans Men", slug: "skinny-fit-jeans-men", brandSlug: "levis", categorySlug: "men-clothing-jeans-skinny-jeans", gender: "men", originalPrice: "119.00", discountPrice: "47.00", discount: 60, material: "Stretch Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 4 }, { size: "30", stock: 5 }, { size: "32", stock: 5 }, { size: "34", stock: 3 }] },
    { name: "Super Skinny Jeans Men", slug: "super-skinny-jeans-men", brandSlug: "g-star-raw", categorySlug: "men-clothing-jeans-skinny-jeans", gender: "men", originalPrice: "139.00", discountPrice: "55.00", discount: 60, material: "98% Cotton 2% Elastane", colors: ["Blue", "Black", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 3 }, { size: "30", stock: 4 }, { size: "32", stock: 5 }, { size: "34", stock: 3 }] },
    { name: "Skinny Biker Jeans Men", slug: "skinny-biker-jeans-men", brandSlug: "replay", categorySlug: "men-clothing-jeans-skinny-jeans", gender: "men", originalPrice: "159.00", discountPrice: "63.00", discount: 60, material: "Stretch Denim", colors: ["Black", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 3 }, { size: "30", stock: 4 }, { size: "32", stock: 4 }, { size: "34", stock: 3 }] },

    // Slim Jeans — men
    { name: "Slim Tapered Jeans Men", slug: "slim-tapered-jeans-men", brandSlug: "levis", categorySlug: "men-clothing-jeans-slim-jeans", gender: "men", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "Cotton Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 4 }, { size: "30", stock: 5 }, { size: "32", stock: 6 }, { size: "34", stock: 4 }, { size: "36", stock: 2 }] },
    { name: "Slim Fit Stretch Jeans Men", slug: "slim-fit-stretch-jeans-men", brandSlug: "g-star-raw", categorySlug: "men-clothing-jeans-slim-jeans", gender: "men", originalPrice: "149.00", discountPrice: "74.00", discount: 50, material: "Stretch Denim", colors: ["Blue", "Grey"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "28", stock: 3 }, { size: "30", stock: 4 }, { size: "32", stock: 5 }, { size: "34", stock: 4 }, { size: "36", stock: 2 }] },
    { name: "Classic Slim Jeans Men", slug: "classic-slim-jeans-men", brandSlug: "replay", categorySlug: "men-clothing-jeans-slim-jeans", gender: "men", originalPrice: "139.00", discountPrice: "55.00", discount: 60, material: "Cotton Blend", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 4 }, { size: "30", stock: 5 }, { size: "32", stock: 5 }, { size: "34", stock: 3 }] },

    // Flared — men
    { name: "Flared Denim Jeans Men", slug: "flared-denim-jeans-men", brandSlug: "levis", categorySlug: "men-clothing-jeans-flared", gender: "men", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Cotton Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 3 }, { size: "30", stock: 4 }, { size: "32", stock: 4 }, { size: "34", stock: 3 }] },
    { name: "Wide Flared Jeans Men", slug: "wide-flared-jeans-men", brandSlug: "g-star-raw", categorySlug: "men-clothing-jeans-flared", gender: "men", originalPrice: "169.00", discountPrice: "67.00", discount: 60, material: "Stretch Denim", colors: ["Blue", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 3 }, { size: "30", stock: 4 }, { size: "32", stock: 4 }, { size: "34", stock: 2 }] },
    { name: "70s Style Flared Jeans Men", slug: "70s-style-flared-jeans-men", brandSlug: "replay", categorySlug: "men-clothing-jeans-flared", gender: "men", originalPrice: "159.00", discountPrice: "63.00", discount: 60, material: "Cotton Blend", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 3 }, { size: "30", stock: 4 }, { size: "32", stock: 4 }, { size: "34", stock: 2 }] },
]

async function seedJeansSubcategories() {
    console.log("Seeding jeans subcategories...")

    const brands = await db.select().from(brand)
    const categories = await db.select().from(category)
    const colors = await db.select().from(color)
    const patterns = await db.select().from(pattern)
    const styles = await db.select().from(style)

    const brandMap = new Map(brands.map(b => [b.slug, b.id]))
    const categoryMap = new Map(categories.map(c => [c.slug, c.id]))
    const colorMap = new Map(colors.map(c => [c.name, c.id]))
    const patternMap = new Map(patterns.map(p => [p.name, p.id]))
    const styleMap = new Map(styles.map(s => [s.name, s.id]))

    let count = 0
    let skipped = 0

    for (const p of jeansSubcategories) {
        const brandId = brandMap.get(p.brandSlug)
        const categoryId = categoryMap.get(p.categorySlug)

        if (!brandId) { console.warn(`⚠ Brand not found: ${p.brandSlug}`); skipped++; continue }
        if (!categoryId) { console.warn(`⚠ Category not found: ${p.categorySlug}`); skipped++; continue }

        const [created] = await db.insert(product).values({
            name: p.name,
            slug: p.slug,
            shortDescription: `${p.name} — premium quality ${p.gender}'s denim.`,
            originalPrice: p.originalPrice,
            discountPrice: p.discountPrice,
            discount: p.discount,
            material: p.material,
            gender: p.gender,
            brandId,
            categoryId,
            isActive: true,
        }).onConflictDoNothing().returning()

        if (!created) { skipped++; continue }

        for (const s of p.sizes) {
            await db.insert(productSize).values({ productId: created.id, size: s.size, stockAmount: s.stock }).onConflictDoNothing()
        }

        for (const colorName of p.colors) {
            const colorId = colorMap.get(colorName)
            if (colorId) await db.insert(productColor).values({ productId: created.id, colorId }).onConflictDoNothing()
        }

        for (const patternName of p.patterns) {
            const patternId = patternMap.get(patternName)
            if (patternId) await db.insert(productPattern).values({ productId: created.id, patternId }).onConflictDoNothing()
        }

        for (const styleName of p.styles) {
            const styleId = styleMap.get(styleName)
            if (styleId) await db.insert(productStyle).values({ productId: created.id, styleId }).onConflictDoNothing()
        }

        count++
    }

    console.log(`✓ ${count} jeans products seeded (${skipped} skipped)`)
}

async function main() {
    try {
        await seedJeansSubcategories()
        console.log("\n✅ Jeans seed completed")
    } catch (error) {
        console.error("❌ Seed failed:", error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

main()