"use server"

import {requireAdmin} from "@/lib/admin/rbac";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {ActionState} from "@/lib/admin/actions/product-actions/createProduct";
import errMessage from "@/lib/admin/actions/users-actions/helpers/errMessage";
import withAudit from "@/lib/admin/actions/users-actions/helpers/withAudit";

export async function revokeUserSessions(userId: string): Promise<ActionState> {
    const { session } = await requireAdmin();

    try {
        await auth.api.revokeUserSessions({ body: { userId }, headers: await headers() });
    } catch (e) {
        return { ok: false, message: errMessage(e, "Не удалось завершить сессии") };
    }

    await withAudit(
        userId,
        "update",
        { after: { sessionsRevoked: true } },
        { id: session.user.id, email: session.user.email },
    );

    return { ok: true, message: "Все сессии завершены" };
}