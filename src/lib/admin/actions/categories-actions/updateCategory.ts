"use server";

import {requireAdmin} from "@/lib/admin/rbac";
import {db} from "@/db";
import {and, eq, ne} from "drizzle-orm";
import {category} from "@/db/schema";
import {categoryFormSchema} from "@/lib/admin/validation/category";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";
import {CategoryActionState} from "@/lib/admin/actions/categories-actions/helpers/CategoryActionState";
import readCategoryForm from "@/lib/admin/actions/categories-actions/helpers/readCategoryForm";
import resolveParent from "@/lib/admin/actions/categories-actions/helpers/resolveParent";
import slugify from "@/lib/slugify";
import sqlShiftLevel from "@/lib/admin/actions/categories-actions/helpers/sqlShiftLevel";
import {getDescendantIds} from "@/lib/admin/queries/categories-operations/getDescendantIds";

export async function updateCategory(
    _prev: CategoryActionState,
    fd: FormData,
): Promise<CategoryActionState> {
    const { session } = await requireAdmin();

    const id = fd.get("id") as string;
    if (!id) return { ok: false, message: "Не передан id" };

    const before = await db.query.category.findFirst({
        where: eq(category.id, id),
    });
    if (!before) return { ok: false, message: "Категория не найдена" };

    const parsed = categoryFormSchema.safeParse(readCategoryForm(fd));
    if (!parsed.success) {
        return { ok: false, errors: parsed.error.flatten().fieldErrors };
    }
    const d = parsed.data;

    const parentCheck = await resolveParent(d.parentId ?? "", d.gender, id);
    if (!parentCheck.ok) {
        return { ok: false, errors: { [parentCheck.field]: [parentCheck.message] } };
    }

    const base = d.slug || slugify(d.name);
    const slug = base.startsWith(d.gender) ? base : `${d.gender}-${base}`;

    const dup = await db.query.category.findFirst({
        where: and(eq(category.slug, slug), ne(category.id, id)),
        columns: { id: true },
    });
    if (dup) return { ok: false, errors: { slug: ["Такой slug уже занят"] } };

    await db.transaction(async (tx) => {
        await tx
            .update(category)
            .set({
                name: d.name,
                slug,
                gender: d.gender,
                level: parentCheck.level,
                parentId: d.parentId || null,
                image: d.image || null,
            })
            .where(eq(category.id, id));

        // Если уровень поменялся — сдвигаем уровни у всего поддерева
        if (parentCheck.level !== before.level) {
            const shift = parentCheck.level - before.level;
            const descendants = await getDescendantIds(id);
            for (const childId of descendants) {
                await tx.execute(
                    sqlShiftLevel(childId, shift),
                );
            }
        }

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "update",
            entityType: "category",
            entityId: id,
            before,
            after: { ...d, slug, level: parentCheck.level },
        });
    });

    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}`);
    return { ok: true, message: "Изменения сохранены" };
}