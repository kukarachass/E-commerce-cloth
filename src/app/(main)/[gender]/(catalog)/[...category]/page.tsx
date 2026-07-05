
import { getProducts } from "@/actions/products/get-products"
import CatalogContainer from "@/components/catalog/CatalogContainer"
import { getCategoryWithSubs } from "@/actions/category/categories"
import { notFound } from "next/navigation"
import {isGender} from "@/lib/isGender";

export default async function CategoryPage({
                                               params,
                                               searchParams,
                                           }: PageProps<"/[gender]/[...category]">) {
    const { gender, category } = await params
    if (!isGender(gender)) notFound()
    const filters = await searchParams

    const categorySlug = category.join("-")
    const slug = `${gender}-${categorySlug}`

    const categoryData = await getCategoryWithSubs(gender, slug)
    if (!categoryData) notFound()

    const { products, total, page, perPage } = await getProducts({
        gender,
        category: categorySlug,
        ...filters,
        subcategory: filters.subcategory
            ? Array.isArray(filters.subcategory) ? filters.subcategory : [filters.subcategory]
            : undefined,
        brand: filters.brand
            ? Array.isArray(filters.brand) ? filters.brand : [filters.brand]
            : undefined,
        page: typeof filters.page === "string" ? filters.page : undefined, // ← читаем page из URL
    })

    const totalPages = Math.ceil(total / perPage)

    return (
        <div>
            <CatalogContainer currentPage={page} totalPages={totalPages} products={products} />
        </div>
    )
}