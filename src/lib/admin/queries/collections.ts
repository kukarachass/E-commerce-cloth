import "server-only";
import { count, desc, eq, ilike } from "drizzle-orm";
import { collection, collectionProduct } from "@/db/schema";
import { db } from "@/db";

interface Props {
    page?: number;
    search?: string;
}

const PER_PAGE = 20;

export async function getCollectionsList({ page = 1, search }: Props) {
    const where = search ? ilike(collection.title, `%${search}%`) : undefined;

    const [rows, [{ total }]] = await Promise.all([
        db
            .select({
                id: collection.id,
                slug: collection.slug,
                title: collection.title,
                description: collection.description,
                banner: collection.banner,
                gender: collection.gender,
                isActive: collection.isActive,
                productCount: db.$count(
                    collectionProduct,
                    eq(collectionProduct.collectionId, collection.id),
                ),
            })
            .from(collection)
            .where(where)
            .orderBy(desc(collection.createdAt))
            .limit(PER_PAGE)
            .offset((page - 1) * PER_PAGE),

        db.select({ total: count() }).from(collection).where(where),
    ]);

    return { rows, total, page, totalPages: Math.ceil(total / PER_PAGE) };
}

export async function getCollectionById(id: string) {
    return (
        (await db.query.collection.findFirst({
            where: (collection, { eq }) => eq(collection.id, id),
        })) ?? null
    );
}