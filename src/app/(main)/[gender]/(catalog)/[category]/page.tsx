import { getProducts } from "@/actions/products/get-products"
import CatalogContainer from "@/components/catalog/CatalogContainer";
import {Gender} from "@/store/useGenderStore";

interface Props {
    params: Promise<{ gender: Gender, category: string }>
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