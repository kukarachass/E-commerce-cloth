"use server"

import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("UNAUTHORIZED");

    const [dbUser] = await db
        .select({
            role: userTable.role,
            banned: userTable.banned,
            banExpires: userTable.banExpires,
        })
        .from(userTable)
        .where(eq(userTable.id, session.user.id))
        .limit(1);

    const banActive =
        dbUser?.banned && (!dbUser.banExpires || dbUser.banExpires > new Date());
    if (banActive) throw new Error("BANNED");

    if (dbUser?.role !== "admin") throw new Error("FORBIDDEN");

    return { session, userId: session.user.id, role: dbUser.role };
}

// для ui
export async function isAdmin() {
    try {
        await requireAdmin();
        return true;
    } catch {
        return false;
    }
}