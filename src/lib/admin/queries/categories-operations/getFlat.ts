import "server-only";

import {db} from "@/db";
import {category, product} from "@/db/schema";
import {and, asc, eq} from "drizzle-orm";
export default async function getFlat() {
    return db
        .select({
            id: category.id,
            name: category.name,
            slug: category.slug,
            gender: category.gender,
            level: category.level,
            parentId: category.parentId,
            productCount: db.$count(
                product,
                and(eq(product.categoryId, category.id), eq(product.isActive, true)),
            ),
        })
        .from(category)
        .orderBy(asc(category.gender), asc(category.level), asc(category.name));
}