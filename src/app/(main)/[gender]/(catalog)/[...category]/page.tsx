// src/app/[gender]/[...category]/page.tsx
import { getProducts } from "@/actions/products/get-products"
import CatalogContainer from "@/components/catalog/CatalogContainer"
import { isGender } from "@/store/useGenderStore"
import { getCategoryWithSubs } from "@/actions/category/categories"
import { notFound } from "next/navigation"

export default async function CategoryPage({
                                               params,
                                               searchParams,
                                           }: PageProps<"/[gender]/[...category]">) {
    const { gender, category } = await params // category: string[]
    if (!isGender(gender)) notFound()
    const filters = await searchParams

    const categorySlug = category.join("-")        // "clothing-coats-parkas"
    const slug = `${gender}-${categorySlug}`         // "women-clothing-coats-parkas"

    const categoryData = await getCategoryWithSubs(gender, slug)
    if (!categoryData) notFound()

    const products = await getProducts({
        gender,
        category: categorySlug,
        ...filters,
        subcategory: filters.subcategory
            ? Array.isArray(filters.subcategory) ? filters.subcategory : [filters.subcategory]
            : undefined,
        brand: filters.brand
            ? Array.isArray(filters.brand) ? filters.brand : [filters.brand]
            : undefined,
    })

    return (
        <div>
            <CatalogContainer products={products} />
        </div>
    )
}