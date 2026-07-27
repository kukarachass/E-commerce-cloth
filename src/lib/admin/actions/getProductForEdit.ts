"use server";


import {db} from "@/db";
import {eq} from "drizzle-orm";
import {product} from "@/db/schema";

export async function getProductForEdit(id: string) {
    const row = await db.query.product.findFirst({
        where: eq(product.id, id),
        with: {
            sizes: true,
            images: true,
        },
    });
    if (!row) return null;

    return {
        ...row,
        images: [...row.images].sort((a, b) => Number(b.isMain) - Number(a.isMain) || a.order - b.order),
    };
}