import { z } from "zod";

export const signInSchema = z.object({
    email: z.email ("Invalid email address"),
    password: z
        .string()
});

export type SignInFormValues = z.infer<typeof signInSchema>;