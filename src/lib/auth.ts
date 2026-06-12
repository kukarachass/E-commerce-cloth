import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db } from '@/db'
import * as schema from '@/db/schema'
import {createAuthMiddleware} from "@better-auth/core/api";
import {GetOrCreateCart} from "@/actions/cart/get-or-create-cart";
import {nextCookies} from "better-auth/next-js";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        },
    },
    user: {
        additionalFields: {
            lastName: {
                type: "string",
                required: false,
            },
            dateOfBirth: {
                type: "string",
                required: false,
            },
            gender: {
                type: "string",
                required: false,
            },
            phoneNumber: {
                type: "string",
                required: false,
            },
            street: {
                type: "string",
                required: false,
            },
            houseNumber: {
                type: "string",
                required: false,
            },
            houseAddition: {
                type: "string",
                required: false,
            },
            postcode: {
                type: "string",
                required: false,
            },
            city: {
                type: "string",
                required: false,
            },
        }
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (
                !ctx.path.startsWith("/sign-in") &&
                !ctx.path.startsWith("/sign-up")
            ) return

            const newSession = ctx.context.newSession
            if (!newSession) return

            const cookieToken = ctx.headers?.get("cookie")
                ?.split(";")
                .find(c => c.trim().startsWith("cart_token="))
                ?.split("=")[1] ?? null

            if (!cookieToken) return

            await db.transaction(async (tx) => {
                await GetOrCreateCart({
                    userId: newSession.user.id,
                    cookieToken,
                    tx,
                })
            })
        })
    },
    plugins: [
        nextCookies(),
    ]
})