"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { collectionProduct, product } from "@/db/schema";
import { requireAdmin } from "@/lib/admin/rbac";
import { logAudit } from "@/lib/admin/audit";
import { FormActionState } from "@/lib/admin/admin-types/FormActionState";

export default async function toggleAddProduct(
    collectionId: string,
    productIds: string[],
    isAdd: boolean,
): Promise<FormActionState> {
    const { session } = await requireAdmin();

    if (productIds.length === 0) {
        return { ok: true, message: "Нечего менять" };
    }

    const collection = await db.query.collection.findFirst({
        where: (c, { eq }) => eq(c.id, collectionId),
        columns: { id: true, slug: true },
    });
    if (!collection) {
        return { ok: false, message: "Коллекция не найдена" };
    }

    // Отсекаем несуществующие id — иначе insert упадёт на внешнем ключе
    const existing = await db
        .select({ id: product.id })
        .from(product)
        .where(inArray(product.id, productIds));

    const validIds = existing.map((p) => p.id);
    if (validIds.length === 0) {
        return { ok: false, message: "Товары не найдены" };
    }

    await db.transaction(async (tx) => {
        if (isAdd) {
            await tx
                .insert(collectionProduct)
                .values(validIds.map((productId) => ({ collectionId, productId })))
                .onConflictDoNothing();
        } else {
            await tx
                .delete(collectionProduct)
                .where(
                    and(
                        eq(collectionProduct.collectionId, collectionId),
                        inArray(collectionProduct.productId, validIds),
                    ),
                );
        }

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "update",
            entityType: "collection",
            entityId: collectionId,
            after: { [isAdd ? "added" : "removed"]: validIds },
        });
    });

    revalidatePath(`/admin/collections/${collectionId}`);
    revalidatePath(`/admin/collections/${collectionId}/products`);
    revalidatePath(`/collections/${collection.slug}`);

    return {
        ok: true,
        message: isAdd
            ? `Добавлено товаров: ${validIds.length}`
            : `Убрано товаров: ${validIds.length}`,
    };
}