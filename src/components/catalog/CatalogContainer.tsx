// CatalogContainer.tsx
import CatalogProductCard from "@/components/catalog/CatalogProductCard"
import { ProductWithDetails } from "@/types/product-details"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { category } from "@/db/schema"
import Pagination from "@/components/catalog/Pagination";

interface Props {
    products: ProductWithDetails[]
    totalPages: number
    currentPage: number
}

export default async function CatalogContainer({ products, currentPage, totalPages }: Props) {
    const cats = await db.query.category.findMany({
        where: eq(category.gender, "women"),
        columns: { name: true, slug: true, parentId: true },
    })

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-2 min-[600px]:grid-cols-3 gap-2 min-[600px]:gap-4 pb-10 xl:px-0 px-4">
                {products.map(product => (
                    <CatalogProductCard key={product.id} product={product} />
                ))}
            </div>
            <div className="flex justify-start xl:px-0 px-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    )
}