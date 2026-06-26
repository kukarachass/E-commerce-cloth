"use server"


import {db} from "@/db";
import {brand, favoriteBrand, product} from "@/db/schema";
import {getServerSession} from "@/lib/get-session";
import {and, desc, eq, max} from "drizzle-orm";

interface SetFavouriteBrandProps {
    brandId: string;
}

export async function toggleFavouriteBrand({ brandId } : SetFavouriteBrandProps){
    const session = await getServerSession();
    if (!session) return { success: false, error: "Unauthorized" }

    const existingBrand = await db.query.favoriteBrand.findFirst({
        where: and(
            eq(favoriteBrand.userId, session.user.id),
            eq(favoriteBrand.brandId, brandId)
        )
    })

    if(existingBrand){
         await db.delete(favoriteBrand).where(
            and(
                eq(favoriteBrand.userId, session.user.id),
                eq(favoriteBrand.brandId, brandId)
            )
        );
        return { success: true, action: "removed" }

    } else{
         await db.insert(favoriteBrand).values({
            userId: session.user.id,
            brandId,
        }).onConflictDoNothing();
        return { success: true, action: "added" }

    }
}

export async function getFavouriteBrands() {
    const session = await getServerSession();
    if (!session) return null;

    const result = await db.query.favoriteBrand.findMany({
        where: eq(favoriteBrand.userId, session.user.id),
        with: {
            brand: true, // возвращает полный IBrand — все поля схемы
        },
        orderBy: desc(favoriteBrand.createdAt),
    });

    return result.map(r => r.brand);
}