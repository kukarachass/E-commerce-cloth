import { db } from "@/db"

interface GetProductProps {
    slug: string
}

export async function getProduct({ slug }: GetProductProps) {
    return await db.query.product.findFirst({
        where: (product, { eq, and }) => and(
            eq(product.slug, slug),
            eq(product.isActive, true),
        ),
        with: {
            brand: true,
            images: {
                orderBy: (image, { asc }) => [asc(image.order)],
            },
            sizes: {
                orderBy: (size, { asc }) => [asc(size.size)],
            },
        },
    })
}