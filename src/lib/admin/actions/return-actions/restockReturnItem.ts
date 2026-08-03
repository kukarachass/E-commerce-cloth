"use server"


import {requireAdmin} from "@/lib/admin/rbac";
import {db} from "@/db";
import {productSize, returnItem} from "@/db/schema";
import {eq, sql} from "drizzle-orm";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";
import {ReturnActionState} from "@/types/returns";

export async function restockReturnItem(
    itemId: string,
): Promise<ReturnActionState> {
    const { session } = await requireAdmin();

    return db.transaction(async (tx) => {
        const [item] = await tx
            .select()
            .from(returnItem)
            .where(eq(returnItem.id, itemId))
            .for("update");

        if (!item) return { ok: false, message: "Позиция не найдена" };
        if (item.restocked) return { ok: false, message: "Уже принято на склад" };
        if (item.status !== "approved") {
            return { ok: false, message: "Сначала одобрите возврат позиции" };
        }

        // productSizeId берём из позиции ЗАКАЗА, не из товара
        const orderItemRow = await tx.query.orderItem.findFirst({
            where: (oi, { eq }) => eq(oi.id, item.orderItemId),
            columns: { productSizeId: true },
        });
        if (!orderItemRow) return { ok: false, message: "Позиция заказа не найдена" };

        await tx
            .update(productSize)
            .set({ stockAmount: sql`${productSize.stockAmount} + ${item.quantity}` })
            .where(eq(productSize.id, orderItemRow.productSizeId));

        await tx
            .update(returnItem)
            .set({ restocked: true })
            .where(eq(returnItem.id, itemId));

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "update",
            entityType: "return_item",
            entityId: itemId,
            before: { restocked: false },
            after: { restocked: true, quantity: item.quantity },
        });

        revalidatePath(`/admin/returns/${item.returnRequestId}`);
        return { ok: true, message: `На склад возвращено: ${item.quantity} шт.` };
    });
}