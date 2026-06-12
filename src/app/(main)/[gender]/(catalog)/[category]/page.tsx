import { getProducts } from "@/actions/products/get-products"
import CatalogContainer from "@/components/catalog/CatalogContainer";
import {Gender, isGender} from "@/store/useGenderStore";
import {getCategoryWithSubs} from "@/actions/category/categories";
import {notFound} from "next/navigation";

// interface Props {
//     params: Promise<{ gender: Gender, category: string }>
//     searchParams: Promise<{
//         subcategory?: string
//         brand?: string[]
//         color?: string
//         pattern?: string
//         style?: string
//         minPrice?: string
//         maxPrice?: string
//         discount?: string
//         sort?: string
//     }>
// }

export default async function CategoryPage({params, searchParams}: PageProps<"/[gender]/[category]">) {
    const { gender, category } = await params
    if (!isGender(gender)) notFound()
    const filters = await searchParams
    const slug = `${gender}-${category}`
    const categoryData = await getCategoryWithSubs(gender, slug)

    if (!categoryData) notFound()
    const products = await getProducts({
        gender,
        category,
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
            <CatalogContainer products={products}/>
        </div>
    )
}