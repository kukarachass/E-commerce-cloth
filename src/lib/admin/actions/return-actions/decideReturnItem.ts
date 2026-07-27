"use server"


import {ReturnItemStatus} from "@/lib/returns/status";
import {requireAdmin} from "@/lib/admin/rbac";
import {returnItem, returnRequest} from "@/db/schema";
import {eq} from "drizzle-orm";
import {canChangeItem, computeRequestStatus} from "@/lib/admin/returns/rules";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";
import {db} from "@/db";
import {ReturnActionState} from "@/types/returns";
import {DbTx} from "@/types/IDb";



export async function decideReturnItem(
    itemId: string,
    to: ReturnItemStatus,
): Promise<ReturnActionState> {
    const { session } = await requireAdmin();

    return db.transaction(async (tx) => {
        const [item] = await tx
            .select()
            .from(returnItem)
            .where(eq(returnItem.id, itemId))
            .for("update");

        if (!item) return { ok: false, message: "Позиция не найдена" };

        const check = canChangeItem(item.status, to);
        if (!check.allowed) return { ok: false, message: check.reason };

        await tx
            .update(returnItem)
            .set({ status: to })
            .where(eq(returnItem.id, itemId));

        await syncRequestStatus(tx, item.returnRequestId);

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "update",
            entityType: "return_item",
            entityId: itemId,
            before: { status: item.status },
            after: { status: to },
        });

        revalidatePath(`/admin/returns/${item.returnRequestId}`);
        revalidatePath("/admin/returns");
        return { ok: true, message: "Решение сохранено" };
    });
}

async function syncRequestStatus(tx: DbTx, requestId: string) {
    const items = await tx
        .select({ status: returnItem.status })
        .from(returnItem)
        .where(eq(returnItem.returnRequestId, requestId));

    await tx
        .update(returnRequest)
        .set({ status: computeRequestStatus(items) })
        .where(eq(returnRequest.id, requestId));
}