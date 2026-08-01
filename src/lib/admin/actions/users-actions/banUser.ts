"use server";

import {requireAdmin} from "@/lib/admin/rbac";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import errMessage from "@/lib/admin/actions/users-actions/helpers/errMessage";
import withAudit from "@/lib/admin/actions/users-actions/helpers/withAudit";
import {ActionState} from "@/lib/admin/actions/product-actions/createProduct";

export async function banUser(
    userId: string,
    banReason: string,
    banExpiresIn?: number, // в секундах; undefined = навсегда
): Promise<ActionState> {
    const { session } = await requireAdmin();

    if (userId === session.user.id) {
        return { ok: false, message: "Нельзя забанить самого себя" };
    }

    try {
        await auth.api.banUser({
            body: { userId, banReason, banExpiresIn },
            headers: await headers(),
        });
    } catch (e) {
        return { ok: false, message: errMessage(e, "Не удалось забанить") };
    }

    await withAudit(
        userId,
        "update",
        { before: { banned: false }, after: { banned: true, banReason, banExpiresIn } },
        { id: session.user.id, email: session.user.email },
    );

    return { ok: true, message: "Пользователь заблокирован" };
}