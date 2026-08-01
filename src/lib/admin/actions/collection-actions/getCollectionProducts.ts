"use server";

import {requireAdmin} from "@/lib/admin/rbac";
import {db} from "@/db";

export default async function getCollectionProductIds(collectionId: string){
    await requireAdmin();
    const products = await db.query.collectionProduct.findMany({where: (collProduct, { eq }) => eq(collProduct.collectionId, collectionId)})
    return products.map(p => p.productId)
}