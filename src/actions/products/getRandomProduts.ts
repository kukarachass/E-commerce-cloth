import {db} from "@/db";
import {Gender} from "@/hooks/useGender";

interface GetRandomProductsProps{
    ids?: string[];
    gender: Gender;
    brandId?: string;
    categoryId?: string;
    limit?: number;
}

export default async function getProductsByCriteria ({ ids, gender, brandId, limit }: GetRandomProductsProps) {
    return await db.query.product.findMany({
        where: (product, { inArray, and, eq}) =>
            and(ids ? inArray(product.id, ids) : undefined, eq(product.gender, gender), brandId ? eq(product.brandId, brandId) : undefined),
        with: {
            brand: true,
            images: {
                orderBy: (image, { asc }) => [asc(image.order)],
            },
            sizes: {
                orderBy: (size, { asc }) => [asc(size.size)],
            },
        },
        limit: limit ?? undefined
    })
}