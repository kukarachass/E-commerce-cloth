"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { product, productSize, productImage } from "@/db/schema";
import { requireAdmin } from "@/lib/admin/rbac";
import { logAudit } from "@/lib/admin/audit";
import { productFormSchema } from "@/lib/admin/validation/product";

export type ActionState = {
    ok: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

export async function createProduct(
    _prev: ActionState,
    formData: FormData,
): Promise<ActionState> {

    const { session } = await requireAdmin();

    const raw = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        shortDescription: formData.get("shortDescription"),
        description: formData.get("description"),
        originalPrice: formData.get("originalPrice"),
        discountPrice: formData.get("discountPrice"),
        material: formData.get("material"),
        careInstructions: formData.get("careInstructions"),
        gender: formData.get("gender"),
        brandId: formData.get("brandId"),
        categoryId: formData.get("categoryId"),
        isActive: formData.get("isActive") === "on",
        sizes: JSON.parse((formData.get("sizes") as string) || "[]"),
        images: JSON.parse((formData.get("images") as string) || "[]"),
    };

    const parsed = productFormSchema.safeParse(raw);
    if (!parsed.success) {
        return { ok: false, errors: parsed.error.flatten().fieldErrors };
    }
    const data = parsed.data;

    // 3. Проверка уникальности slug — до вставки, чтобы дать понятную ошибку
    const existing = await db.query.product.findFirst({
        where: eq(product.slug, data.slug),
        columns: { id: true },
    });
    if (existing) {
        return { ok: false, errors: { slug: ["Такой slug уже занят"] } };
    }

    // 4. ЗАПИСЬ — всё в одной транзакции
    const discount =
        Number(data.originalPrice) > 0
            ? Math.round(
                (1 - Number(data.discountPrice) / Number(data.originalPrice)) * 100,
            )
            : 0;

    const newId = await db.transaction(async (tx) => {
        const [created] = await tx
            .insert(product)
            .values({
                name: data.name,
                slug: data.slug,
                shortDescription: data.shortDescription || null,
                description: data.description || null,
                originalPrice: data.originalPrice,
                discountPrice: data.discountPrice,
                discount,
                material: data.material || null,
                careInstructions: data.careInstructions || null,
                gender: data.gender,
                brandId: data.brandId,
                categoryId: data.categoryId,
                isActive: data.isActive,
            })
            .returning({ id: product.id });

        if (data.sizes.length) {
            await tx.insert(productSize).values(
                data.sizes.map((s) => ({ ...s, productId: created.id })),
            );
        }

        if (data.images.length) {
            await tx.insert(productImage).values(
                data.images.map((img, i) => ({
                    productId: created.id,
                    url: img.url,
                    isMain: img.isMain,
                    order: i,
                })),
            );
        }

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "create",
            entityType: "product",
            entityId: created.id,
            after: { ...data, discount },
        });

        return created.id;
    });

    // 5. Сброс кэша и переход
    revalidatePath("/admin/products");
    redirect(`/admin/products/${newId}`);
}