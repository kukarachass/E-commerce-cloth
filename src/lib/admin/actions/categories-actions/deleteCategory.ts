"use server";


import {requireAdmin} from "@/lib/admin/rbac";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {category, product} from "@/db/schema";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";
import {CategoryActionState} from "@/lib/admin/actions/categories-actions/helpers/CategoryActionState";

export async function deleteCategory(
    id: string,
): Promise<CategoryActionState> {
    const { session } = await requireAdmin();

    const before = await db.query.category.findFirst({
        where: eq(category.id, id),
    });
    if (!before) return { ok: false, message: "Категория не найдена" };

    // Есть подкатегории — удалять нельзя.
    // В схеме onDelete: "cascade", то есть база молча снесёт всё поддерево.
    const children = await db.query.category.findFirst({
        where: eq(category.parentId, id),
        columns: { id: true },
    });
    if (children) {
        return { ok: false, message: "Сначала удалите или перенесите подкатегории" };
    }

    // Есть товары — тоже нельзя: product.categoryId это notNull
    const [{ n }] = await db
        .select({ n: db.$count(product, eq(product.categoryId, id)) })
        .from(category)
        .where(eq(category.id, id));

    if (Number(n) > 0) {
        return {
            ok: false,
            message: `В категории ${n} товаров — перенесите их в другую`,
        };
    }

    await db.transaction(async (tx) => {
        await tx.delete(category).where(eq(category.id, id));
        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "delete",
            entityType: "category",
            entityId: id,
            before,
        });
    });

    revalidatePath("/admin/categories");
    return { ok: true, message: "Категория удалена" };
}