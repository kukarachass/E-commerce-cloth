"use server"


import {getServerSession} from "@/lib/get-session";
import {favoriteProduct} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {db} from "@/db";

export async function toggleFavouriteProduct({ productId }: { productId: string }) {
    const session = await getServerSession()
    if (!session) return { success: false, error: "Unauthorized" }

    const existing = await db.query.favoriteProduct.findFirst({
        where: and(
            eq(favoriteProduct.userId, session.user.id),
            eq(favoriteProduct.productId, productId)
        )
    })

    if (existing) {
        await db.delete(favoriteProduct).where(
            and(
                eq(favoriteProduct.userId, session.user.id),
                eq(favoriteProduct.productId, productId)
            )
        )
        return { success: true, action: "removed" }
    }

    await db.insert(favoriteProduct).values({
        userId: session.user.id,
        productId,
    }).onConflictDoNothing()

    return { success: true, action: "added" }
}

export async function getFavouriteProducts() {
    const session = await getServerSession();
    if (!session) return null;

    return db.query.favoriteProduct.findMany({
        where: eq(favoriteProduct.userId, session.user.id),
        with: {
            product: {
                with: {
                    brand: true,
                    images: true,
                    sizes: true,
                }
            }
        }
    })
}