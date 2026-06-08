// actions/user/get-user.ts
"use server"

import { db } from "@/db"
import { getServerSession } from "@/lib/get-session"
import { address } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getUser() {
    const session = await getServerSession()
    if (!session) return null

     const user = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, session.user.id),
        with: {
            addresses: {
                where: eq(address.userId, session.user.id),
                limit: 1,
            },
            orders: true,
        }
    })

    if(!user) throw new Error("User not found")

    const defaultAddress = user.addresses[0] ?? null

    const isAddressComplete = Boolean(
        defaultAddress?.street &&
        defaultAddress?.houseNumber &&
        defaultAddress?.postcode &&
        defaultAddress?.city &&
        defaultAddress?.country
    )

    const isProfileComplete = Boolean(user.name && user.lastName)

    const readyToCheckout = isAddressComplete && isProfileComplete

    return { ...user, readyToCheckout, address: defaultAddress }
}