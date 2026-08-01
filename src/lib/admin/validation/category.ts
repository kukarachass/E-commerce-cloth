import { z } from "zod";

export const categoryFormSchema = z.object({
    name: z.string().trim().min(1, "Название обязательно").max(120),
    slug: z.string().trim().regex(/^[a-z0-9-]*$/, "Строчные латинские, цифры, дефис"),
    gender: z.enum(["women", "men", "unisex"]),
    parentId: z.string().uuid().optional().or(z.literal("")),
    image: z.string().url().optional().or(z.literal("")),
});