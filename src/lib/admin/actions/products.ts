"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {and, eq, ne} from "drizzle-orm";
import {db} from "@/db";
import {product, productSize, productImage} from "@/db/schema";
import {requireAdmin} from "@/lib/admin/rbac";
import {logAudit} from "@/lib/admin/audit";
import {productFormSchema} from "@/lib/admin/validation/product";

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

    const raw = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        shortDescription: formData.get("shortDescription"),
        description: formData.get("description"),
        oldPrice: formData.get("originalPrice"),
        price: formData.get("discountPrice"),
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
        return {ok: false, errors: parsed.error.flatten().fieldErrors};
    }
    const data = parsed.data;

// Нормализация цен: запятую в точку, старая цена по умолчанию = текущей
    const price = data.price.replace(",", ".");
    const oldPrice = data.oldPrice ? data.oldPrice.replace(",", ".") : price;

    const discount =
        Number(oldPrice) > Number(price)
            ? Math.round((1 - Number(price) / Number(oldPrice)) * 100)
            : 0;

// slug: если пустой — генерим из названия
    const slug = data.slug?.trim() || slugify(data.name);

// Проверка уникальности — уже по финальному slug
    const existing = await db.query.product.findFirst({
        where: eq(product.slug, slug),
        columns: {id: true},
    });
    if (existing) {
        return {ok: false, errors: {slug: ["Такой slug уже занят"]}};
    }

    const newId = await db.transaction(async (tx) => {
        const [created] = await tx
            .insert(product)
            .values({
                name: data.name,
                slug,                        // ← локальная, не data.slug
                shortDescription: data.shortDescription || null,
                description: data.description || null,
                originalPrice: oldPrice,     // ← строка гарантированно есть
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

function slugify(s: string) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}