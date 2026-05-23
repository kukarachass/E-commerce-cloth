import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db } from '@/db'
import * as schema from '@/db/schema'

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
    }
})