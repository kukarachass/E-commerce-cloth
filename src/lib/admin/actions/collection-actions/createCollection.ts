"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { collection } from "@/db/schema";
import { FormActionState } from "@/lib/admin/admin-types/FormActionState";
import { requireAdmin } from "@/lib/admin/rbac";
import { collectionFormSchema } from "@/lib/admin/validation/collection";
import readCollectionForm from "@/lib/admin/actions/collection-actions/helpers/readCollectionForm";
import { logAudit } from "@/lib/admin/audit";
import slugify from "@/lib/slugify";

export async function createCollection(
    _prev: FormActionState,
    formData: FormData,
): Promise<FormActionState> {
    const { session } = await requireAdmin();

    const parsed = collectionFormSchema.safeParse(readCollectionForm(formData));
    if (!parsed.success) {
        return { ok: false, errors: parsed.error.flatten().fieldErrors };
    }

    const data = parsed.data;
    const slug = data.slug || slugify(data.title);

    const duplicate = await db.query.collection.findFirst({
        where: (collection, { eq }) => eq(collection.slug, slug),
        columns: { id: true },
    });
    if (duplicate) {
        return { ok: false, errors: { slug: ["Такой slug уже занят"] } };
    }

    await db.transaction(async (tx) => {
        const [created] = await tx
            .insert(collection)
            .values({
                title: data.title,
                slug,
                description: data.description || null,
                banner: data.banner || null,
                gender: data.gender,
                isActive: data.isActive,
            })
            .returning({ id: collection.id });

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "create",
            entityType: "collection",
            entityId: created.id,
            after: { ...data, slug },
        });
    });

    revalidatePath("/admin/collections");
    revalidatePath(`/collections/${slug}`);

    return { ok: true, message: `Коллекция «${data.title}» создана` };
}