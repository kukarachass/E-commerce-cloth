"use server";


import {ActionState} from "@/lib/admin/actions/product-actions/createProduct";
import {requireAdmin} from "@/lib/admin/rbac";
import {db} from "@/db";
import {and, eq, ne} from "drizzle-orm";
import {product, productImage, productSize} from "@/db/schema";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";
import validateAndNormalizeProduct from "@/lib/admin/validateAndNormalizeProduct";
import slugify from "@/lib/slugify";

export async function updateProduct(
    _prev: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const { session } = await requireAdmin();

    const id = formData.get("id") as string;
    if (!id) return { ok: false, message: "Не передан id товара" };

    // Читаем текущее состояние — нужно для audit log (before) и проверок
    const before = await db.query.product.findFirst({
        where: eq(product.id, id),
        with: { sizes: true, images: true },
    });
    if (!before) return { ok: false, message: "Товар не найден" };

    const result = await validateAndNormalizeProduct({ formData});
    if(!result.ok){
        return { ok: false, errors: result.errors };
    }
    const { data, discount, price, oldPrice} = result;

    // slug: если пустой — генерим из названия
    const slug = data.slug?.trim() || slugify(data.name);

// проверка уникальности по финальному слагу
    const existing = await db.query.product.findFirst({
        where: and(eq(product.slug, slug), ne(product.id, id)),
        columns: {id: true},
    });
    if (existing) {
        return {ok: false, errors: {slug: ["Такой slug уже занят"]}};
    }

    await db.transaction(async (tx) => {
        await tx
            .update(product)
            .set({
                name: data.name,
                slug,
                shortDescription: data.shortDescription || null,
                description: data.description || null,
                originalPrice: oldPrice,
                discountPrice: price,
                discount,
                material: data.material || null,
                careInstructions: data.careInstructions || null,
                gender: data.gender,
                brandId: data.brandId,
                categoryId: data.categoryId,
                isActive: data.isActive,
            })
            .where(eq(product.id, id));

        // ── РАЗМЕРЫ: сверяем, а не удаляем всё ──
        const incoming = data.sizes;
        const existing = before.sizes;

        const keyOf = (s: { size: string; sizeSystem: string }) => `${s.sizeSystem}|${s.size}`;
        const existingByKey = new Map(existing.map((s) => [keyOf(s), s]));
        const incomingKeys = new Set(incoming.map(keyOf));

        for (const s of incoming) {
            const found = existingByKey.get(keyOf(s));
            if (found) {
                // был — обновляем только остаток
                if (found.stockAmount !== s.stockAmount) {
                    await tx
                        .update(productSize)
                        .set({ stockAmount: s.stockAmount })
                        .where(eq(productSize.id, found.id));
                }
            } else {
                // новый — вставляем
                await tx.insert(productSize).values({
                    productId: id,
                    size: s.size,
                    sizeSystem: s.sizeSystem,
                    stockAmount: s.stockAmount,
                });
            }
        }

        // убранные размеры — обнуляем остаток, но НЕ удаляем (см. объяснение ниже)
        for (const s of existing) {
            if (!incomingKeys.has(keyOf(s)) && s.stockAmount !== 0) {
                await tx
                    .update(productSize)
                    .set({ stockAmount: 0 })
                    .where(eq(productSize.id, s.id));
            }
        }

        // ── КАРТИНКИ: их можно смело перезаписывать ──
        await tx.delete(productImage).where(eq(productImage.productId, id));
        if (data.images.length) {
            await tx.insert(productImage).values(
                data.images.map((img, i) => ({
                    productId: id,
                    url: img.url,
                    isMain: img.isMain,
                    order: i,
                })),
            );
        }

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "update",
            entityType: "product",
            entityId: id,
            before,
            after: { ...data, slug, discount },
        });
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath(`/product/${slug}`);

    return { ok: true, message: "Изменения сохранены",};
}