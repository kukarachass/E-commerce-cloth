"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { collection } from "@/db/schema";
import { FormActionState } from "@/lib/admin/admin-types/FormActionState";
import { requireAdmin } from "@/lib/admin/rbac";
import { logAudit } from "@/lib/admin/audit";

export async function toggleCollectionActive(
    id: string,
    isActive: boolean,
): Promise<FormActionState> {
    const { session } = await requireAdmin();

    const before = await db.query.collection.findFirst({
        where: (collection, { eq }) => eq(collection.id, id),
        columns: { id: true, slug: true, isActive: true },
    });
    if (!before) return { ok: false, message: "Коллекция не найдена" };

    await db.transaction(async (tx) => {
        await tx.update(collection).set({ isActive }).where(eq(collection.id, id));

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: isActive ? "restore" : "delete",
            entityType: "collection",
            entityId: id,
            before: { isActive: before.isActive },
            after: { isActive },
        });
    });

    revalidatePath("/admin/collections");
    revalidatePath(`/collections/${before.slug}`);

    return { ok: true, message: isActive ? "Коллекция активна" : "Коллекция скрыта" };
}