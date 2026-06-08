import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z
        .string({ error: "Invalid name" })
        .min(2, "Name must be at least 2 characters")
        .regex(/^[a-zA-ZА-Яа-яЁё\s\-]+$/, "Invalid name"),

    lastName: z
        .string({ error: "Invalid last name" })
        .min(2, "Last name must be at least 2 characters")
        .regex(/^[a-zA-ZА-Яа-яЁё\s\-]+$/, "Invalid last name"),

    email: z.email("Invalid email address"),

    phoneNumber: z
        .string()
        .min(7, "Phone number is too short")
        .max(15, "Phone number is too long")
        .regex(/^\+?[0-9\s\-\(\)]+$/, "Invalid phone number")
        .or(z.literal("")),

    // update-profile-schema.ts — убираем transform
    dateOfBirth: z
        .string()
        .refine((val) => {
            if (!val) return true // пустая строка — ок
            const date = new Date(val)
            const minDate = new Date("1900-01-01")
            return date >= minDate
        }, "Invalid date of birth")
        .refine((val) => {
            if (!val) return true
            const date = new Date(val)
            const now = new Date()
            const minAge = new Date()
            minAge.setFullYear(now.getFullYear() - 18)
            return date <= minAge
        }, "You must be at least 18 years old")
        .optional(),

    gender: z.enum(["male", "female", "other"]).nullable().optional(),

    street: z
        .string()
        .min(2, "Street must be at least 2 characters")
        .max(100, "Street is too long"),

    houseNumber: z
        .string()
        .min(1, "House number is required")
        .max(10, "House number is too long")
        .regex(/^[0-9]+$/, "House number must contain only digits"),

    houseAddition: z
        .string()
        .max(10, "House addition is too long")
        .or(z.literal("")),

    postcode: z
        .string()
        .min(3, "Postcode is too short")
        .max(10, "Postcode is too long")
        .regex(/^[a-zA-Z0-9\s\-]+$/, "Invalid postcode"),

    city: z
        .string()
        .min(2, "City must be at least 2 characters")
        .max(100, "City is too long")
        .regex(/^[a-zA-ZА-Яа-яЁё\s\-]+$/, "Invalid city"),
})

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>
