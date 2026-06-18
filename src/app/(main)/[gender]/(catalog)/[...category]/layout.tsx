
import CatalogLayout from "@/components/catalog/CatalogLayout"
import { getCategoryWithSubs } from "@/actions/category/categories"
import { getProducts } from "@/actions/products/get-products"
import { isGender } from "@/store/useGenderStore"
import { getBrands } from "@/actions/filters/brands/brands"
import { getSizes } from "@/actions/filters/sizes/sizes"
import { getPrice } from "@/actions/filters/price/price"
import { getColors } from "@/actions/filters/color/color"
import { getPatterns } from "@/actions/filters/pattern/pattern"
import { getStyles } from "@/actions/filters/style/style"
import { getDiscounts } from "@/actions/filters/discount/dicount"
import { notFound } from "next/navigation"

export default async function CategoryLayout({
                                                 children,
                                                 params,
                                             }: LayoutProps<"/[gender]/[...category]">) {
    const { gender, category } = await params
    if (!isGender(gender)) notFound()

    const categorySlug = category.join("-")
    const slug = `${gender}-${categorySlug}`

    const categoryData = await getCategoryWithSubs(gender, slug)

    const [brands, sizes, price, colors, patterns, styles, discounts, products] = await Promise.all([
        getBrands({ gender, categorySlug }),
        getSizes({ gender, categorySlug }),
        getPrice({ gender, categorySlug }),
        getColors({ gender, categorySlug }),
        getPatterns({ gender, categorySlug }),
        getStyles({ gender, categorySlug }),
        getDiscounts({ gender, categorySlug }),
        getProducts({ gender, category: categorySlug }),
    ])

    return (
        <CatalogLayout
            category={categorySlug}
            title={categoryData?.name ?? categorySlug}
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