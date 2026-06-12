"use server"

import { headers } from "next/headers"
import { eq } from "drizzle-orm"
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

export async function signUpAndSaveProfile(input: Input) {
    // регистрация НА СЕРВЕРЕ; nextCookies() в lib/auth выставит сессию-куку
    const res = await auth.api.signUpEmail({
        body: {
            email: input.email,
            password: input.password,
            name: `${input.name} ${input.lastName}`,
        },
        headers: await headers(),
    })

    const userId = res.user.id // id напрямую из результата — без зависимости от ambient-сессии

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
}