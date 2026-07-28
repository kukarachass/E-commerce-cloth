"use server";

import {revalidatePath} from "next/cache";
import {db} from "@/db";
import {product, productSize, productImage} from "@/db/schema";
import {requireAdmin} from "@/lib/admin/rbac";
import {logAudit} from "@/lib/admin/audit";
import validateAndNormalizeProduct from "@/lib/admin/validateAndNormalizeProduct";
import slugify from "@/lib/slugify";
import {eq} from "drizzle-orm";

export type ActionState = {
    ok: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

export async function createProduct(
    _prev: ActionState,
    formData: FormData,
): Promise<ActionState> {

    const {session} = await requireAdmin();

    const result = await validateAndNormalizeProduct({ formData});
    if(!result.ok){
        return { ok: false, errors: result.errors };
    }

    const { data, discount, price, oldPrice} = result;

    const slug = data.slug?.trim() || slugify(data.name);

    const existing = await db.query.product.findFirst({
        where: eq(product.slug, slug),
        columns: {id: true},
    });
    if (existing) {
        return {ok: false, errors: {slug: ["Такой slug уже занят"]}};
    }

    await db.transaction(async (tx) => {
        const [created] = await tx
            .insert(product)
            .values({
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
            .returning({id: product.id});

        if (data.sizes.length) {
            await tx.insert(productSize).values(
                data.sizes.map((s) => ({...s, productId: created.id})),
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
            after: {...data, discount},
        });

        return created.id;
    });

    // 5. Сброс кэша и переход
    revalidatePath("/admin/products");
    return { ok: true, message: `Товар «${data.name}» создан` };
}

