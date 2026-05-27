import CatalogLayout from "@/components/catalog/CatalogLayout"
import { ReactNode } from "react"
import {getCategoryWithSubs} from "@/actions/category/categories";
import {getBrands} from "@/actions/brands/brands";

interface Props {
    children: ReactNode
    params: Promise<{ gender: string; category: string }>
}

export default async function CategoryLayout({ children, params }: Props) {
    const { gender, category } = await params

    // slug в БД построен как "women-clothing", "men-shoes" и тд
    const slug = `${gender}-${category}`
    const categoryData = await getCategoryWithSubs(gender, slug)
    const brands = await getBrands({ gender, categorySlug: category })


    return (
        <CatalogLayout
            title={categoryData?.name ?? category}
            items={categoryData?.subcategories ?? []}
            brands={brands}
        >
            {children}
        </CatalogLayout>
    )
}