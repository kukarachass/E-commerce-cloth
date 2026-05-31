import { config } from "dotenv"
config({ path: ".env" })

import { db } from "@/db/seed-client"
import { brand } from "@/db/schema"
import { eq } from "drizzle-orm"

const brandTags: Record<string, string[]> = {
    "nike":            ["Sale", "New discount", "New items"],
    "adidas":          ["Sale", "New discount", "New items"],
    "tommy-hilfiger":  ["New discount"],
    "calvin-klein":    ["Sale", "New items"],
    "levis":           ["Sale", "New discount"],
    "puma":            ["Sale", "New items"],
    "scotch-and-soda": ["New discount"],
    "g-star-raw":      ["Sale"],
    "new-balance":     ["New discount"],
    "lacoste":         ["Sale"],
    "guess":           ["New discount"],
    "hugo-boss":       ["Sale", "New discount"],
    "vans":            ["Sale", "New items"],
    "the-north-face":  ["New discount"],
    "replay":          ["Sale", "New items"],
}

async function seedBrandTags() {
    console.log("Seeding brand tags...")

    let count = 0

    for (const [slug, tags] of Object.entries(brandTags)) {
        await db.update(brand)
            .set({ tags })
            .where(eq(brand.slug, slug))

        console.log(`✓ ${slug}: [${tags.join(", ")}]`)
        count++
    }

    console.log(`\n✓ Tags updated for ${count} brands`)
}

async function main() {
    try {
        await seedBrandTags()
        console.log("\n✅ Brand tags seed completed")
    } catch (error) {
        console.error("❌ Seed failed:", error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

main()