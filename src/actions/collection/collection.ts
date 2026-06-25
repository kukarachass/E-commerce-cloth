"use server"

import {db} from "@/db";
import {and, eq} from "drizzle-orm";
import {collection} from "@/db/schema";
import {Gender} from "@/hooks/useGender";

interface CollectionProps {
    slug: string;
    gender: Gender;
}

// actions/collections.ts
export async function getCollection({ slug, gender }: CollectionProps) {
    return db.query.collection.findFirst({
        where: and(
            eq(collection.slug, slug),
            eq(collection.gender, gender),
        ),
        with: {
            products: {
                with: {
                    product: {
                        with: {
                            brand: true,
                            images: true,
                            sizes: true,
                        }
                    }
                }
            }
        }
    })
}

export async function getCollections(gender: Gender) {
    return db.query.collection.findMany({
        where: and(
            eq(collection.gender, gender),
            eq(collection.isActive, true),
        )
    })
}