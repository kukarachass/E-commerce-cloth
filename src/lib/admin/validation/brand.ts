import { z } from "zod";

export const brandFormSchema = z.object({
    name: z.string().trim().min(1, "Название обязательно").max(120),
    slug: z.string().trim().regex(/^[a-z0-9-]*$/, "Строчные латинские, цифры, дефис"),
    description: z.string().trim().min(1, "Описание обязательно"),
    promoDetailsText: z.string().trim().optional(),
    imageUrl: z.string().url("Загрузите логотип"),
    tags: z.array(z.string().trim().min(1)).default([]),
    isActive: z.boolean(),
});