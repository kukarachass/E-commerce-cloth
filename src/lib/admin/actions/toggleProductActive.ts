import {ActionState} from "@/lib/admin/actions/createProduct";
import {requireAdmin} from "@/lib/admin/rbac";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {product} from "@/db/schema";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";

export async function toggleProductActive(
    id: string,
    isActive: boolean,
): Promise<ActionState> {
    const { session } = await requireAdmin();

    const before = await db.query.product.findFirst({
        where: eq(product.id, id),
        columns: { id: true, name: true, isActive: true },
    });
    if (!before) return { ok: false, message: "Товар не найден" };

    await db.transaction(async (tx) => {
        await tx.update(product).set({ isActive }).where(eq(product.id, id));
        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: isActive ? "restore" : "delete",
            entityType: "product",
            entityId: id,
            before: { isActive: before.isActive },
            after: { isActive },
        });
    });

    revalidatePath("/admin/products");
    return { ok: true, message: isActive ? "Товар опубликован" : "Товар скрыт" };
}