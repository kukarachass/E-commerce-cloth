import { z } from "zod";

export const collectionFormSchema = z.object({
    title: z.string().trim().min(1, "Название обязательно").max(150),
    slug: z.string().trim().regex(/^[a-z0-9-]*$/, "Строчные латинские, цифры, дефис"),
    description: z.string().trim().optional(),
    banner: z.string().url("Некорректный URL").optional().or(z.literal("")),
    gender: z.enum(["women", "men", "unisex"]),
    isActive: z.boolean(),
    productIds: z.array(z.string().uuid()).default([]),
});