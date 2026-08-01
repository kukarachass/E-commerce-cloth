import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";
import { ac, admin, customer } from "@/lib/permissions";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        inferAdditionalFields<typeof auth>(),
        adminClient({ ac, roles: { admin, customer } }),
    ],
})