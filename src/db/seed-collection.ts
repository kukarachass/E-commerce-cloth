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
        "women-sportswear-sports-accessories-1",
        "women-clothing-coats-single-breasted-coats-1",
        "women-accessories-sunglasses-2",
        "women-clothing-shirts-and-tops-blouses-1",
        "women-clothing-jackets-faux-fur-jackets-3",
        "women-clothing-nightwear-dressing-gowns-and-kimonos-1",
        "women-clothing-shirts-and-tops-tanks-and-camis-2",
        "women-clothing-coats-double-breasted-coats-2",
        "women-clothing-coats-wrap-coats-1",
        "women-clothing-skirts-maxi-skirts-3",
        "women-sportswear-skiwear-3",
        "women-shoes-boots-1",
        "women-clothing-swimwear-tankinis-1",
        "women-accessories-bags-3",
        "women-clothing-coats-parkas-2",
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