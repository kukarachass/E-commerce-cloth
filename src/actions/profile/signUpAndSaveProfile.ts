"use server"

import { headers } from "next/headers"
import { eq } from "drizzle-orm"
import { APIError } from "better-auth/api"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { user, address as addressTable } from "@/db/schema"
import type { AddressSnapshot } from "@/types/IOrder"

type Input = {
    email: string
    password: string
    name: string
    lastName: string
    phoneNumber?: string
    address: AddressSnapshot
}

export type SignUpResult =
    | { ok: true }
    | { ok: false; error: "EMAIL_EXISTS" | "UNKNOWN" }

export async function signUpAndSaveProfile(input: Input): Promise<SignUpResult> {
    let userId: string

    try {
        const res = await auth.api.signUpEmail({
            body: {
                email: input.email,
                password: input.password,
                name: `${input.name} ${input.lastName}`,
            },
            headers: await headers(),
        })
        userId = res.user.id
    } catch (err) {
        if (err instanceof APIError) {
            const code = (err.body as { code?: string } | undefined)?.code
            if (code?.startsWith("USER_ALREADY_EXISTS") || err.statusCode === 422) {
                return { ok: false, error: "EMAIL_EXISTS" }
            }
        }
        return { ok: false, error: "UNKNOWN" }
    }

    // регистрация прошла — сохраняем профиль и адрес
    await db.update(user)
        .set({ lastName: input.lastName, phoneNumber: input.phoneNumber })
        .where(eq(user.id, userId))

    await db.insert(addressTable).values({
        userId,
        street: input.address.street,
        houseNumber: input.address.houseNumber,
        houseAddition: input.address.houseAddition,
        postcode: input.address.postcode,
        city: input.address.city,
        country: input.address.country,
        isDefault: true,
    })

    return { ok: true }
}