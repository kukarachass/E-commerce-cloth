"use server"

import {ProductWithDetails} from "@/types/product-details";
import {db} from "@/db";
import {CartItemWithDetails} from "@/types/cart";

interface ProductsRecommendationsProps {
    cartItems?: CartItemWithDetails[];
    gender: string;
}

const LIMIT = 11;


export default async function productsRecommendations({cartItems, gender}: ProductsRecommendationsProps): Promise<ProductWithDetails[]> {
    if (!gender) throw new Error("products and gender are required");

    if (cartItems && cartItems.length > 0) {
        const products = cartItems.map(c => c.product)
        const productIds = cartItems.map(p => p.id);
        const categoryIds = [...new Set(products.map(p => p.categoryId))];

        // По 2 продукта из каждой категории корзины
        const results = await Promise.all(
            categoryIds.map(catId =>
                db.query.product.findMany({
                    where: (p, {eq, and, notInArray}) => and(
                        eq(p.categoryId, catId),
                        eq(p.gender, gender),
                        notInArray(p.id, productIds),  // не показывать то что уже в корзине
                    ),
                    with: {sizes: true, images: true, brand: true},
                    limit: 2,
                })
            )
        );

        return results.flat().slice(0, LIMIT);
    }
    return await db.query.product.findMany({
        where: (product, {eq}) => eq(product.gender, gender),
        with: {sizes: true, images: true, brand: true,},
        orderBy: (p, {desc}) => desc(p.createdAt),
        limit: LIMIT
    })
}