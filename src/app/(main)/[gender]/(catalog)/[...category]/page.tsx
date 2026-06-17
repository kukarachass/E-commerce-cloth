import { getProducts } from "@/actions/products/get-products"
import CatalogContainer from "@/components/catalog/CatalogContainer"
import { isGender } from "@/store/useGenderStore"
import { getCategoryWithSubs } from "@/actions/category/categories"
import { notFound } from "next/navigation"

export default async function CategoryPage({ params, searchParams }: PageProps<"/[gender]/[...category]">) {
    const { gender, category } = await params   // category: string[] — например ["clothing", "t-shirts"]
    if (!isGender(gender)) notFound()

    const filters = await searchParams

    // делаем: склеиваем сегменты пути в slug-хвост
    // чтобы: получить ровно ту строку, что хранится в БД ("clothing-t-shirts")
    // потому что: твои slug'и хранятся по принципу пути, и URL теперь несёт весь путь
    const categorySlug = category.join("-")           // "clothing-t-shirts"
    const fullSlug = `${gender}-${categorySlug}`       // "women-clothing-t-shirts"

    const categoryData = await getCategoryWithSubs(gender, fullSlug)
    if (!categoryData) notFound()

    const products = await getProducts({
        gender,
        category: categorySlug,   // ← отдаём "clothing-t-shirts", внутри getCategoryIds снова добавит gender
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