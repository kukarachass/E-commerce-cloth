import "server-only";
import { db } from "@/db";
import { product, brand, productImage } from "@/db/schema";
import { and, eq, ilike, desc, sql, count } from "drizzle-orm";

export type ProductListParams = {
    page?: number;
    search?: string;
    status?: "active" | "inactive" | "all";
};

const PER_PAGE = 20;

export async function getProductList({page = 1, search, status = "all" }: ProductListParams) {
    const conditions = [];

    if (search) conditions.push(ilike(product.name, `%${search}%`));
    if (status === "active") conditions.push(eq(product.isActive, true));
    if (status === "inactive") conditions.push(eq(product.isActive, false));

    const where = conditions.length ? and(...conditions) : undefined;

    const [rows, [{ total }]] = await Promise.all([
        db
            .select({
                id: product.id,
                name: product.name,
                slug: product.slug,
                discountPrice: product.discountPrice,
                originalPrice: product.originalPrice,
                discount: product.discount,
                isActive: product.isActive,
                gender: product.gender,
                createdAt: product.createdAt,
                brandName: brand.name,
                image: sql<string | null>`(
          select ${productImage.url} from ${productImage}
          where ${productImage.productId} = ${product.id}
          order by ${productImage.isMain} desc, ${productImage.order} asc
          limit 1
        )`,
            })
            .from(product)
            .leftJoin(brand, eq(product.brandId, brand.id))
            .where(where)
            .orderBy(desc(product.createdAt))
            .limit(PER_PAGE)
            .offset((page - 1) * PER_PAGE),

        db.select({ total: count() }).from(product).where(where),
    ]);

    return {
        rows,
        total,
        page,
        perPage: PER_PAGE,
        totalPages: Math.ceil(total / PER_PAGE),
    };
}