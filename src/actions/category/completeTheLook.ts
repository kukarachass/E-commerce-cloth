"use server"


import {db} from "@/db";
import {ProductWithDetails} from "@/types/product-details";

interface getCompleteTheLookProps{
    gender: string;
    categoryId: string;
}

export default async function getCompleteTheLook({ gender, categoryId }: getCompleteTheLookProps): Promise<ProductWithDetails[]> {
    if (!categoryId || !gender) throw new Error("gender and categoryId are required");

    const currentCategory = await db.query.category.findFirst({
        where: (c, { eq }) => eq(c.id, categoryId)
    });
    if (!currentCategory) throw new Error("Category not found");
    if (!currentCategory.parentId) throw new Error("Category has no parent");

    // Все дети родителя (сиблинги + текущая)
    const siblings = await db.query.category.findMany({
        where: (c, { eq }) => eq(c.parentId, currentCategory.parentId!)
    });

    const excludeIds = [
        currentCategory.parentId,          // сам родитель
        ...siblings.map(c => c.id),        // все дети родителя (включая текущую)
    ];

    const rawCategories = await db.query.category.findMany({
        where: (c, { eq, and, notInArray }) => and(
            eq(c.gender, gender),
            notInArray(c.id, excludeIds)
        )
    });

    const categoryIds = rawCategories.map(c => c.id);
    if (!categoryIds.length) return [];

    return await db.query.product.findMany({
        where: (product, { inArray }) => inArray(product.categoryId, categoryIds),
        with: {
            sizes: true,
            images: true,
            brand: true,
        },
        limit: 11
    });
}
