import { config } from "dotenv"
config({ path: ".env" })

import { db } from "@/db/seed-client"
import { product, productImage } from "@/db/schema"

async function seedImages() {
    console.log("Seeding product images...")

    const products = await db.select({
        id: product.id,
        slug: product.slug,
        gender: product.gender,
    }).from(product)

    console.log(`Found ${products.length} products`)

    let count = 0

    for (const p of products) {
        // Главное изображение
        await db.insert(productImage).values({
            productId: p.id,
            url: `https://picsum.photos/seed/${p.slug}/600/800`,
            isMain: true,
            order: 0,
        }).onConflictDoNothing()

        // Второе изображение
        await db.insert(productImage).values({
            productId: p.id,
            url: `https://picsum.photos/seed/${p.slug}-2/600/800`,
            isMain: false,
            order: 1,
        }).onConflictDoNothing()

        // Третье изображение
        await db.insert(productImage).values({
            productId: p.id,
            url: `https://picsum.photos/seed/${p.slug}-3/600/800`,
            isMain: false,
            order: 2,
        }).onConflictDoNothing()

        count++
    }

    console.log(`✓ Images seeded for ${count} products`)
}

async function main() {
    try {
        await seedImages()
        console.log("\n✅ Images seed completed")
    } catch (error) {
        console.error("❌ Seed failed:", error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

main()