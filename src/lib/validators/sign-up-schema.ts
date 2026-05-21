import { z } from "zod";

export const signUpSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters"),

    email: z.email("Invalid email address"),

    password: z
        .string()
        .min(8, "Minimum 8 characters")
        .regex(/[a-z]/, "At least one lowercase letter")
        .regex(/[A-Z]/, "At least one uppercase letter")
        .regex(/[0-9]/, "At least one number")
        .regex(/[^a-zA-Z0-9]/, "At least one special character"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;