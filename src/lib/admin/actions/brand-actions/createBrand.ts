"use server"

import {requireAdmin} from "@/lib/admin/rbac";
import {brandFormSchema} from "@/lib/admin/validation/brand";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {brand} from "@/db/schema";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";
import {BrandActionState} from "@/lib/admin/actions/brand-actions/types/BrandActionState";
import slugify from "@/lib/slugify";
import readBrandForm from "@/lib/admin/actions/brand-actions/helpers/readBrandForm";

export async function createBrand(
    _prev: BrandActionState,
    fd: FormData,
): Promise<BrandActionState> {
    const { session } = await requireAdmin();

    const parsed = brandFormSchema.safeParse(readBrandForm(fd));
    if (!parsed.success) {
        return { ok: false, errors: parsed.error.flatten().fieldErrors };
    }
    const d = parsed.data;
    const slug = d.slug || slugify(d.name);

    const dup = await db.query.brand.findFirst({
        where: eq(brand.slug, slug),
        columns: { id: true },
    });
    if (dup) return { ok: false, errors: { slug: ["Такой slug уже занят"] } };

    await db.transaction(async (tx) => {
        const [created] = await tx
            .insert(brand)
            .values({
                name: d.name,
                slug,
                description: d.description,
                promoDetailsText: d.promoDetailsText || null,
                imageUrl: d.imageUrl,
                tags: d.tags,
                isActive: d.isActive,
            })
            .returning({ id: brand.id });

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "create",
            entityType: "brand",
            entityId: created.id,
            after: { ...d, slug },
        });
    });

    revalidatePath("/admin/brands");
    return { ok: true, message: `Бренд «${d.name}» создан` };
}

