"use server";

import {requireAdmin} from "@/lib/admin/rbac";
import {categoryFormSchema} from "@/lib/admin/validation/category";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {category} from "@/db/schema";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";
import {CategoryActionState} from "@/lib/admin/actions/categories-actions/helpers/CategoryActionState";
import readBrandForm from "@/lib/admin/actions/brand-actions/helpers/readBrandForm";
import resolveParent from "@/lib/admin/actions/categories-actions/helpers/resolveParent";
import slugify from "@/lib/slugify";

export async function createCategory(
    _prev: CategoryActionState,
    fd: FormData,
): Promise<CategoryActionState> {
    const { session } = await requireAdmin();

    const parsed = categoryFormSchema.safeParse(readBrandForm(fd));
    if (!parsed.success) {
        return { ok: false, errors: parsed.error.flatten().fieldErrors };
    }
    const d = parsed.data;

    const parentCheck = await resolveParent(d.parentId ?? "", d.gender);
    if (!parentCheck.ok) {
        return { ok: false, errors: { [parentCheck.field]: [parentCheck.message] } };
    }

    // slug строим с префиксом гендера — так у women/jeans и men/jeans
    // получатся разные slug, а он у тебя unique
    const base = d.slug || slugify(d.name);
    const slug = base.startsWith(d.gender) ? base : `${d.gender}-${base}`;

    const dup = await db.query.category.findFirst({
        where: eq(category.slug, slug),
        columns: { id: true },
    });
    if (dup) return { ok: false, errors: { slug: ["Такой slug уже занят"] } };

    await db.transaction(async (tx) => {
        const [created] = await tx
            .insert(category)
            .values({
                name: d.name,
                slug,
                gender: d.gender,
                level: parentCheck.level,
                parentId: d.parentId || null,
                image: d.image || null,
            })
            .returning({ id: category.id });

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "create",
            entityType: "category",
            entityId: created.id,
            after: { ...d, slug, level: parentCheck.level },
        });
    });

    revalidatePath("/admin/categories");
    return { ok: true, message: `Категория «${d.name}» создана` };
}