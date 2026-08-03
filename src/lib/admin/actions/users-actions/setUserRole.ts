"use server"

import {requireAdmin} from "@/lib/admin/rbac";
import {db} from "@/db";
import {user as userTable} from "@/db/schema";
import {eq} from "drizzle-orm";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {ActionState} from "@/lib/admin/actions/product-actions/createProduct";
import errMessage from "@/lib/admin/actions/users-actions/helpers/errMessage";
import withAudit from "@/lib/admin/actions/users-actions/helpers/withAudit";

export async function setUserRole(
    userId: string,
    role: "customer" | "admin",
): Promise<ActionState> {
    const { session } = await requireAdmin();

    if (userId === session.user.id) {
        return { ok: false, message: "Нельзя менять собственную роль" };
    }

    const [before] = await db
        .select({ role: userTable.role })
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);

    try {
        await auth.api.setRole({ body: { userId, role }, headers: await headers() });
    } catch (e) {
        return { ok: false, message: errMessage(e, "Не удалось сменить роль") };
    }

    await withAudit(
        userId,
        "update",
        { before, after: { role } },
        { id: session.user.id, email: session.user.email },
    );

    return { ok: true, message: `Роль изменена на «${role}»` };
}