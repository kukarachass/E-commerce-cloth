"use server"


import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {updateProfileSchema, UpdateProfileValues} from "@/lib/validators/update-profile-schema";
import {z} from "zod";
import {db} from "@/db";
import {user} from "@/db/schema";
import { eq } from "drizzle-orm"

export async function updateProfile(data: Omit<UpdateProfileValues, "id">){
    const session = await auth.api.getSession({ headers: await headers() })
    if(!session) throw new Error("Unauthorized");

    const parsed = updateProfileSchema.safeParse(data);
    if (!parsed.success) return { error: z.treeifyError(parsed.error) }

    const [updated] = await db.update(user)
        .set(parsed.data)
        .where(eq(user.id, session.user.id))
        .returning()

    return { data: updated }
}