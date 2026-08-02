import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLog, user } from "@/db/schema";

/**
 * Короткая лента последних действий для дашборда.
 * Полный журнал со всеми фильтрами и диффом живёт в /admin/audit —
 * здесь нужны только «кто, что и когда».
 */
export async function getRecentActivity(limit = 7) {
    return db
        .select({
            id: auditLog.id,
            actorEmail: auditLog.actorEmail,
            actorName: user.name,
            action: auditLog.action,
            entityType: auditLog.entityType,
            entityId: auditLog.entityId,
            createdAt: auditLog.createdAt,
        })
        .from(auditLog)
        .leftJoin(user, eq(auditLog.actorId, user.id))
        .orderBy(desc(auditLog.createdAt))
        .limit(limit);
}
