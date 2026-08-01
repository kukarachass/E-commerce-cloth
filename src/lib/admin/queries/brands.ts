import "server-only";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "@/db";
import { brand, product } from "@/db/schema";

const PER_PAGE = 20;

export async function getBrandList({
                                       page = 1,
                                       search,
                                   }: {
    page?: number;
    search?: string;
}) {
    const where = search ? ilike(brand.name, `%${search}%`) : undefined;

    const [rows, [{ total }]] = await Promise.all([
        db
            .select({
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                imageUrl: brand.imageUrl,
                isActive: brand.isActive,
                tags: brand.tags,
                // сколько активных товаров у бренда
                productCount: db.$count(
                    product,
                    and(eq(product.brandId, brand.id), eq(product.isActive, true)),
                ),
            })
            .from(brand)
            .where(where)
            .orderBy(desc(brand.createdAt))
            .limit(PER_PAGE)
            .offset((page - 1) * PER_PAGE),

        db.select({ total: count() }).from(brand).where(where),
    ]);

    return { rows, total, page, totalPages: Math.ceil(total / PER_PAGE) };
}

export async function getBrandById(id: string) {
    return (
        (await db.query.brand.findFirst({ where: eq(brand.id, id) })) ?? null
    );
}