"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { collection } from "@/db/schema";
import { FormActionState } from "@/lib/admin/admin-types/FormActionState";
import { requireAdmin } from "@/lib/admin/rbac";
import { collectionFormSchema } from "@/lib/admin/validation/collection";
import readCollectionForm from "@/lib/admin/actions/collection-actions/helpers/readCollectionForm";
import { logAudit } from "@/lib/admin/audit";
import slugify from "@/lib/slugify";

export async function updateCollection(
    _prev: FormActionState,
    formData: FormData,
): Promise<FormActionState> {
    const { session } = await requireAdmin();

    const id = formData.get("id") as string;
    if (!id) return { ok: false, message: "Id не передан" };

    const before = await db.query.collection.findFirst({
        where: (collection, { eq }) => eq(collection.id, id),
    });
    if (!before) {
        return { ok: false, message: `Коллекция с id: ${id} не найдена.` };
    }

    const parsed = collectionFormSchema.safeParse(readCollectionForm(formData));
    if (!parsed.success) {
        return { ok: false, errors: parsed.error.flatten().fieldErrors };
    }

    const data = parsed.data;
    const slug = data.slug || slugify(data.title);

    const duplicate = await db.query.collection.findFirst({
        where: (collection, { eq, ne, and }) =>
            and(eq(collection.slug, slug), ne(collection.id, id)),
        columns: { id: true },
    });
    if (duplicate) {
        return { ok: false, errors: { slug: [`Slug «${slug}» уже занят`] } };
    }

    await db.transaction(async (tx) => {
        await tx
            .update(collection)
            .set({
                title: data.title,
                slug,
                description: data.description || null,
                banner: data.banner || null,
                gender: data.gender,
                isActive: data.isActive,
            })
            .where(eq(collection.id, id));

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "update",
            entityType: "collection",
            entityId: id,
            before,
            after: { ...data, slug },
        });
    });

    revalidatePath("/admin/collections");
    revalidatePath(`/admin/collections/${id}`);
    revalidatePath(`/collections/${slug}`);
    // если slug менялся — сбрасываем и старый путь
    if (before.slug !== slug) revalidatePath(`/collections/${before.slug}`);

    return { ok: true, message: "Изменения сохранены" };
}