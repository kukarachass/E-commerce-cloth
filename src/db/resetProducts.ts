// db/seeds/reset-products.ts
import { config } from "dotenv"
config({ path: ".env" })

import { db } from "@/db/seed-client"
import { sql } from "drizzle-orm"

async function resetProducts() {

    await db.execute(sql`TRUNCATE TABLE product RESTART IDENTITY CASCADE`)

}

resetProducts()
    .then(() => process.exit(0))
    .catch(err => {
        console.error("❌ Failed:", err)
        process.exit(1)
    })