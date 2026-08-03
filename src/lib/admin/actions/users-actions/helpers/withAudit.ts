import {db} from "@/db";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";

export default async function withAudit(
    userId: string,
    action: "update" | "delete",
    payload: { before?: unknown; after?: unknown },
    actor: { id: string; email: string },
) {
    await db.transaction(async (tx) => {
        await logAudit(tx, {
            actorId: actor.id,
            actorEmail: actor.email,
            action,
            entityType: "user",
            entityId: userId,
            before: payload.before,
            after: payload.after,
        });
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
}