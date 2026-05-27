// src/db/seed-client.ts
import { config } from "dotenv"
config({ path: ".env" })

import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "@/db/schema"
import postgres from "pg"

const client = new postgres.Pool({
    connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(client, { schema })