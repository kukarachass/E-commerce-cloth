"use server"

import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Единственная точка проверки "это админ?".
 * Зовут: layout админки и КАЖДЫЙ мутирующий server action.
 */
export async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("UNAUTHORIZED");

    const [dbUser] = await db
        .select({ role: userTable.role })
        .from(userTable)
        .where(eq(userTable.id, session.user.id))
        .limit(1);

    if (dbUser?.role !== "admin") throw new Error("FORBIDDEN");

    return { session, userId: session.user.id, role: dbUser.role };
}

/** Мягкая версия для UI: не кидает ошибку, просто отвечает да/нет */
export async function isAdmin() {
    try {
        await requireAdmin();
        return true;
    } catch {
        return false;
    }
}