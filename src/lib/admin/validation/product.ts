import { z } from "zod";

export const productFormSchema = z.object({
    name: z.string().trim().min(1, "Название обязательно").max(200),
    slug: z.string().trim().regex(/^[a-z0-9-]*$/, "Только строчные латинские, цифры, дефис"),
    shortDescription: z.string().trim().max(500).optional(),
    description: z.string().trim().optional(),

    // Фактическая цена — обязательна (в БД notNull)
    price: z.string().trim().regex(/^\d+([.,]\d{1,2})?$/, "Формат: 19.99"),
    // Старая зачёркнутая — только если есть скидка
    oldPrice: z.string().trim().regex(/^\d+([.,]\d{1,2})?$/, "Формат: 19.99").optional().or(z.literal("")),

    material: z.string().trim().optional(),
    careInstructions: z.string().trim().optional(),
    gender: z.enum(["women", "men", "unisex"]),
    brandId: z.string().uuid("Выберите бренд"),
    categoryId: z.string().uuid("Выберите категорию"),
    isActive: z.boolean(),

    sizes: z.array(z.object({
        size: z.string().trim().min(1, "Укажите размер"),
        sizeSystem: z.enum(["INT","UK","EU","US","FR","IT","DE","Waist","Waist/Length","Other","Years","Size (cm)"]),
        stockAmount: z.coerce.number().int().min(0),
    })).min(1, "Добавьте хотя бы один размер"),

    images: z.array(z.object({ url: z.string().url(), isMain: z.boolean() })).default([]),
})
    .refine(
        (d) => !d.oldPrice || Number(d.oldPrice.replace(",", ".")) >= Number(d.price.replace(",", ".")),
        { message: "Старая цена не может быть ниже текущей", path: ["oldPrice"] },
    );

export type ProductFormValues = z.infer<typeof productFormSchema>;