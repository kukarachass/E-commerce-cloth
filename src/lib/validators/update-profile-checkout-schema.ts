import { updateProfileSchema } from "./update-profile-schema"
import {z} from "zod";

export const updateProfileCheckoutSchema = updateProfileSchema.omit({
    dateOfBirth: true,
    gender: true,
})

export type UpdateProfileCheckoutValues = z.infer<typeof updateProfileCheckoutSchema>