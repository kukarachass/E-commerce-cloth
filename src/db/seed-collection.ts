import { config } from "dotenv"
config({ path: ".env" })

import { db } from "@/db/seed-client"
import { collection, collectionProduct, product } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"

async function seedCollections() {
    console.log("Seeding collections...")

    // Создаём коллекцию
    const [summerCollection] = await db.insert(collection).values({
        slug: "everything-summer",
        title: "Everything Summer",
        description: "From beach days to late sunset drinks — this is your go-to summer edit.",
        banner: null,
        gender: "women",
        isActive: true,
    }).onConflictDoNothing().returning()

    if (!summerCollection) {
        console.log("Collection already exists, skipping...")
        return
    }

    console.log(`✓ Collection created: ${summerCollection.title}`)

    // Берём продукты подходящие для летней коллекции
    const summerSlugs = [
        "triangle-bikini-set-women",
        "one-piece-swimsuit-ribbed",
        "high-waist-bikini-bottom",
        "leather-strappy-sandal-women",
        "platform-sandal-cork-sole",
        "canvas-espadrille-wedge-women",
        "stripe-jute-espadrilles-women",
        "floral-wrap-midi-dress",
        "striped-cotton-shirt-dress",
        "pleated-midi-skirt",
        "floral-print-wrap-skirt",
        "linen-cropped-top-women",
        "wide-leg-linen-trousers-women",
        "linen-wide-leg-jumpsuit",
        "toe-post-flat-sandal-women",
    ]

    const products = await db.select({ id: product.id })
        .from(product)
        .where(inArray(product.slug, summerSlugs))

    if (products.length === 0) {
        console.warn("⚠ No products found for summer collection")
        return
    }

    await db.insert(collectionProduct).values(
        products.map(p => ({
            collectionId: summerCollection.id,
            productId: p.id,
        }))
    ).onConflictDoNothing()

    console.log(`✓ ${products.length} products added to collection`)
}

async function main() {
    try {
        await seedCollections()
        console.log("\n✅ Collections seed completed")
    } catch (error) {
        console.error("❌ Seed failed:", error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

main()