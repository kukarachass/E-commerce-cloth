"use server"

import {requireAdmin} from "@/lib/admin/rbac";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import errMessage from "@/lib/admin/actions/users-actions/helpers/errMessage";
import withAudit from "@/lib/admin/actions/users-actions/helpers/withAudit";
import {ActionState} from "@/lib/admin/actions/product-actions/createProduct";

export async function verifyUserEmail(userId: string): Promise<ActionState> {
    const { session } = await requireAdmin();

    try {
        await auth.api.adminUpdateUser({
            body: { userId, data: { emailVerified: true } },
            headers: await headers(),
        });
    } catch (e) {
        return { ok: false, message: errMessage(e, "Не удалось подтвердить email") };
    }

    await withAudit(
        userId,
        "update",
        { before: { emailVerified: false }, after: { emailVerified: true } },
        { id: session.user.id, email: session.user.email },
    );

    return { ok: true, message: "Email подтверждён" };
}