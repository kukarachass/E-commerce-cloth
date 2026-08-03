import "server-only";
import { headers } from "next/headers";
import { auditLog } from "@/db/schema";
import type { db as Database } from "@/db";

type Tx = Parameters<Parameters<typeof Database.transaction>[0]>[0];

export async function logAudit(
    tx: Tx,
    input: {
        actorId: string;
        actorEmail?: string | null;
        action: "create" | "update" | "delete" | "restore";
        entityType: string;
        entityId: string;
        before?: unknown;
        after?: unknown;
    },
) {
    const h = await headers();
    await tx.insert(auditLog).values({
        actorId: input.actorId,
        actorEmail: input.actorEmail ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        before: input.before ?? null,
        after: input.after ?? null,
        ipAddress: h.get("x-forwarded-for")?.split(",")[0] ?? null,
        userAgent: h.get("user-agent") ?? null,
    });
}