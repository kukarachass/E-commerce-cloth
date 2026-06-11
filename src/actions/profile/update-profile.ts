"use server"


import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {updateProfileSchema, UpdateProfileValues} from "@/lib/validators/update-profile-schema";
import {z} from "zod";
import {db} from "@/db";
import {address, user} from "@/db/schema";
import { eq } from "drizzle-orm"
import {
    updateProfileCheckoutSchema,
    UpdateProfileCheckoutValues
} from "@/lib/validators/update-profile-checkout-schema";

export async function updateProfile(data: Omit<UpdateProfileValues | UpdateProfileCheckoutValues, "id">) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) throw new Error("Unauthorized")

    const hasProfileFields = "dateOfBirth" in data || "gender" in data
    const schema = hasProfileFields ? updateProfileSchema : updateProfileCheckoutSchema

    const parsed = schema.safeParse(data);

    if (!parsed.success) {
        return { error: z.treeifyError(parsed.error) }
    }

    const { name, lastName, street, houseNumber, houseAddition, postcode, city } = parsed.data


    const dateOfBirth = "dateOfBirth" in parsed.data
        ? (parsed.data.dateOfBirth as string | null | undefined)
        : undefined

    const gender = "gender" in parsed.data
        ? (parsed.data.gender as "male" | "female" | "other" | null | undefined)
        : undefined

    const result = await db.transaction(async (tx) => {
        const [updatedUser] = await tx
            .update(user)
            .set({
                name,
                lastName,
                ...(dateOfBirth !== undefined && { dateOfBirth }),
                ...(gender !== undefined && { gender }),
            })
            .where(eq(user.id, session.user.id))
            .returning()

        const [updatedAddress] = await tx
            .update(address)
            .set({
                street,
                houseNumber,
                houseAddition,
                postcode,
                city,
            })
            .where(eq(address.userId, session.user.id))
            .returning()

        if (updatedAddress) {
            return {
                user: updatedUser,
                address: updatedAddress,
            }
        }

        const [createdAddress] = await tx
            .insert(address)
            .values({
                userId: session.user.id,
                street,
                houseNumber,
                houseAddition,
                postcode,
                city,
            })
            .returning()

        return {
            user: updatedUser,
            address: createdAddress,
        }
    })

    return { data: result }
}