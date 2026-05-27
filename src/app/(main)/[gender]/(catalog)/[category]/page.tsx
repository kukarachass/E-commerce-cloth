import { getProducts } from "@/actions/products/get-products"
import CatalogContainer from "@/components/catalog/CatalogContainer";

interface Props {
    params: Promise<{ gender: string, category: string }>
    searchParams: Promise<{
        subcategory?: string
        brand?: string[]
        color?: string
        pattern?: string
        style?: string
        minPrice?: string
        maxPrice?: string
        discount?: string
        sort?: string
    }>
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { gender, category } = await params
    const filters = await searchParams

    const products = await getProducts({
        gender,
        category,
        ...filters,
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