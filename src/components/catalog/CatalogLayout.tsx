"use client"

import FilterBar from "@/components/catalog/FilterBar"
import Sidebar from "@/components/catalog/sidebar/Sidebar"
import { useMiddleBarHeight } from "@/store/useHeaderBarHeightStore"
import { Category } from "@/types/filters/category"
import { Brand } from "@/types/filters/brands"
import { Size } from "@/types/filters/size"
import { Price } from "@/types/filters/price"
import { Color } from "@/types/filters/color"
import { Pattern } from "@/types/filters/pattern"
import { Style } from "@/types/filters/style"
import { Discount } from "@/types/filters/discount"
import { ProductWithDetails } from "@/types/product-details"
import MobileCategoryDrawer from "@/components/catalog/sidebar/adaptive/MobileCategoryDrawer";
import CategoryHeader from "@/components/catalog/sidebar/adaptive/CategoryHeader";

interface CatalogLayoutProps {
    children: React.ReactNode
    items: Category[]
    sizes: Size[]
    title: string
    brands: Brand[]
    category: string
    price: Price[]
    colors: Color[]
    patterns: Pattern[]
    styles: Style[]
    products: ProductWithDetails[]
    discounts: Discount[]
}

export default function CatalogLayout({
                                          children, items, title, brands, sizes, category,
                                          price, colors, patterns, styles, discounts, products,
                                      }: CatalogLayoutProps) {
    const middleBarHeight = useMiddleBarHeight(state => state.middleBarHeight)

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full">
            <aside
                style={{ top: middleBarHeight }}
                className="hidden lg:block sticky self-start w-[240px] xl:w-[290px] shrink-0"
            >
                <Sidebar products={products} title={title} items={items} />
            </aside>

            <MobileCategoryDrawer title={title} items={items} products={products} />

            <div className="flex flex-col gap-4 sm:gap-8 w-full min-w-0">
                <div className="lg:hidden pt-2">
                    <CategoryHeader title={title} resultCount={products.length} />
                </div>

                <div
                    style={{ top: middleBarHeight }}
                    className="sticky w-full z-20 bg-white"
                >
                    <FilterBar
                        patterns={patterns} price={price} category={category}
                        brands={brands} sizes={sizes} colors={colors}
                        styles={styles} discounts={discounts}
                    />
                </div>

                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
}