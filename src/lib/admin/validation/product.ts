import { z } from "zod";

export const productFormSchema = z.object({
    name: z.string().trim().min(1, "Название обязательно").max(200),
    slug: z
        .string()
        .trim()
        .min(1, "Slug обязателен")
        .regex(/^[a-z0-9-]+$/, "Только строчные латинские буквы, цифры и дефис"),
    shortDescription: z.string().trim().max(500).optional().or(z.literal("")),
    description: z.string().trim().optional().or(z.literal("")),

    // decimal в БД = строка. Проверяем формат "123.45"
    originalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Формат: 19.99"),
    discountPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Формат: 19.99"),

    material: z.string().trim().optional().or(z.literal("")),
    careInstructions: z.string().trim().optional().or(z.literal("")),
    gender: z.enum(["women", "men", "unisex"]),
    brandId: z.string().uuid("Выберите бренд"),
    categoryId: z.string().uuid("Выберите категорию"),
    isActive: z.boolean(),

    sizes: z
        .array(
            z.object({
                size: z.string().trim().min(1),
                sizeSystem: z.enum([
                    "INT","UK","EU","US","FR","IT","DE",
                    "Waist","Waist/Length","Other","Years","Size (cm)",
                ]),
                stockAmount: z.number().int().min(0),
            }),
        )
        .min(1, "Добавьте хотя бы один размер"),

    images: z.array(z.object({ url: z.string().url(), isMain: z.boolean() })).default([]),
})
    .refine(
        (d) => Number(d.discountPrice) <= Number(d.originalPrice),
        { message: "Цена со скидкой не может быть выше обычной", path: ["discountPrice"] },
    );

export type ProductFormValues = z.infer<typeof productFormSchema>;