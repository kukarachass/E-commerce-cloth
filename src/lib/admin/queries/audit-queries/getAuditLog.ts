import "server-only";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { auditLog, user } from "@/db/schema";
import { requireAdmin } from "@/lib/admin/rbac";

const PER_PAGE = 50;

export type AuditAction = "create" | "update" | "delete" | "restore" | "login" | "export";

export interface AuditListParams {
    page?: number;
    search?: string;       // по email актора или id сущности
    action?: AuditAction;
    entityType?: string;
}

export default async function getAuditLog({
                                              page = 1, search, action, entityType,
                                          }: AuditListParams) {
    await requireAdmin();

    const conditions = [];

    if (search) {
        conditions.push(
            or(
                ilike(auditLog.actorEmail, `%${search}%`),
                ilike(auditLog.entityId, `%${search}%`),
            ),
        );
    }
    if (action) conditions.push(eq(auditLog.action, action));
    if (entityType) conditions.push(eq(auditLog.entityType, entityType));

    const where = conditions.length ? and(...conditions) : undefined;

    const [rows, [{ total }], entityTypes] = await Promise.all([
        db
            .select({
                id: auditLog.id,
                actorId: auditLog.actorId,
                actorEmail: auditLog.actorEmail,
                actorName: user.name,
                action: auditLog.action,
                entityType: auditLog.entityType,
                entityId: auditLog.entityId,
                before: auditLog.before,
                after: auditLog.after,
                ipAddress: auditLog.ipAddress,
                userAgent: auditLog.userAgent,
                createdAt: auditLog.createdAt,
            })
            .from(auditLog)
            .leftJoin(user, eq(auditLog.actorId, user.id))
            .where(where)
            .orderBy(desc(auditLog.createdAt))
            .limit(PER_PAGE)
            .offset((page - 1) * PER_PAGE),

        db.select({ total: count() }).from(auditLog).where(where),

        // для выпадашки фильтра — какие типы сущностей вообще есть в логе
        db.selectDistinct({ entityType: auditLog.entityType }).from(auditLog),
    ]);

    return {
        rows,
        total,
        page,
        perPage: PER_PAGE,
        totalPages: Math.ceil(total / PER_PAGE),
        entityTypes: entityTypes.map((e) => e.entityType).sort(),
    };
}