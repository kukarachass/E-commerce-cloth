"use server"

import { ProductWithDetails } from "@/types/product-details";
import { db } from "@/db";
import { CartItemWithDetails } from "@/types/cart";

interface ProductsRecommendationsProps {
    cartItems?: CartItemWithDetails[];
    gender: string;
}

const LIMIT = 11;

export default async function productsRecommendations({ cartItems, gender }: ProductsRecommendationsProps): Promise<ProductWithDetails[]> {
    if (!gender) throw new Error("gender is required");

    if (cartItems && cartItems.length > 0) {
        console.log("карт айтемы есть")
        const products = cartItems.map(c => c.product)
        const productIds = cartItems.map(c => c.productId);
        const categoryIds = [...new Set(products.map(p => p.categoryId))];

        const results = await Promise.all(
            categoryIds.map(catId =>
                db.query.product.findMany({
                    where: (p, { eq, and, notInArray }) => and(
                        eq(p.categoryId, catId),
                        eq(p.gender, gender),
                        notInArray(p.id, productIds),
                    ),
                    with: { sizes: true, images: true, brand: true },
                    limit: 2,
                })
            )
        );
        console.error("результаты", results.flat().length)

        return results.flat().slice(0, LIMIT);
    }
    console.warn("карт айтемов нет")
    return await db.query.product.findMany({
        where: (product, { eq }) => eq(product.gender, gender),
        with: { sizes: true, images: true, brand: true },
        orderBy: (p, { desc }) => desc(p.createdAt),
        limit: LIMIT
    })
}