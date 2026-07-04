// CatalogContainer.tsx
import CatalogProductCard from "@/components/catalog/CatalogProductCard"
import { ProductWithDetails } from "@/types/product-details"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { category } from "@/db/schema"

interface Props {
    products: ProductWithDetails[]
    variant?: "catalog" | "collection"
}

export default async function CatalogContainer({ products, variant = "catalog" }: Props) {
    const cats = await db.query.category.findMany({
        where: eq(category.gender, "women"),
        columns: { name: true, slug: true, parentId: true },
    })

    return (
        <div className="grid grid-cols-2 min-[600px]:grid-cols-3 gap-2 min-[600px]:gap-4 pb-10 xl:px-0 px-4">
            {products.map(product => (
                <CatalogProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}