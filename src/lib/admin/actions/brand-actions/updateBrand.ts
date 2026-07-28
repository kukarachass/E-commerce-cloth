"use server"

import {requireAdmin} from "@/lib/admin/rbac";
import {db} from "@/db";
import {and, eq, ne} from "drizzle-orm";
import {brand} from "@/db/schema";
import {brandFormSchema} from "@/lib/admin/validation/brand";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";
import {BrandActionState} from "@/lib/admin/actions/brand-actions/types/BrandActionState";
import slugify from "@/lib/slugify";
import readForm from "@/lib/admin/actions/brand-actions/helpers/readForm";

export async function updateBrand(
    _prev: BrandActionState,
    fd: FormData,
): Promise<BrandActionState> {
    const { session } = await requireAdmin();

    const id = fd.get("id") as string;
    if (!id) return { ok: false, message: "Не передан id" };

    const before = await db.query.brand.findFirst({ where: eq(brand.id, id) });
    if (!before) return { ok: false, message: "Бренд не найден" };

    const parsed = brandFormSchema.safeParse(readForm(fd));
    if (!parsed.success) {
        return { ok: false, errors: parsed.error.flatten().fieldErrors };
    }
    const d = parsed.data;
    const slug = d.slug || slugify(d.name);

    const dup = await db.query.brand.findFirst({
        where: and(eq(brand.slug, slug), ne(brand.id, id)),
        columns: { id: true },
    });
    if (dup) return { ok: false, errors: { slug: ["Такой slug уже занят"] } };

    await db.transaction(async (tx) => {
        await tx
            .update(brand)
            .set({
                name: d.name,
                slug,
                description: d.description,
                promoDetailsText: d.promoDetailsText || null,
                imageUrl: d.imageUrl,
                tags: d.tags,
                isActive: d.isActive,
            })
            .where(eq(brand.id, id));

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "update",
            entityType: "brand",
            entityId: id,
            before,
            after: { ...d, slug },
        });
    });

    revalidatePath("/admin/brands");
    revalidatePath(`/admin/brands/${id}`);
    return { ok: true, message: "Изменения сохранены" };
}