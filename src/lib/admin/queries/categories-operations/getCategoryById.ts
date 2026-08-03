import "server-only";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {category} from "@/db/schema";

export async function getCategoryById(id: string) {
    return (
        (await db.query.category.findFirst({ where: eq(category.id, id) })) ?? null
    );
}