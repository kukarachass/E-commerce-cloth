import CatalogLayout from "@/components/catalog/CatalogLayout"
import { ReactNode } from "react"
import {getCategoryWithSubs} from "@/actions/category/categories";
import {getBrands} from "@/actions/brands/brands";
import {getSizes} from "@/actions/sizes/sizes";
import {getPrice} from "@/actions/price/price";
import {getColors} from "@/actions/color/color";
import {getPatterns} from "@/actions/pattern/pattern";
import {getStyles} from "@/actions/style/style";
import {getDiscounts} from "@/actions/discount/dicount";
import {getProducts} from "@/actions/products/get-products";

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
    const sizes = await getSizes({ gender, categorySlug: category })
    const price = await getPrice({ gender, categorySlug: category })
    const colors = await getColors({ gender, categorySlug: category })
    const patterns = await getPatterns({ gender, categorySlug: category })
    const styles = await getStyles({ gender, categorySlug: category })
    const discounts = await getDiscounts({ gender, categorySlug: category })
    const products = await getProducts({ gender, category});

    return (
        <CatalogLayout
            category={category}
            title={categoryData?.name ?? category}
            items={categoryData?.subcategories ?? []}
            brands={brands}
            sizes={sizes}
            price={price}
            colors={colors}
            patterns={patterns}
            styles={styles}
            discounts={discounts}
            products={products}
        >
            {children}
        </CatalogLayout>
    )
}