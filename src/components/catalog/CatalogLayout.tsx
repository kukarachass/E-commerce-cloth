import FilterBar from "@/components/catalog/FilterBar";
import Sidebar from "@/components/catalog/sidebar/Sidebar";
import {Category} from "@/types/filters/category";
import {Brand} from "@/types/filters/brands";
import {Size} from "@/types/filters/size";
import {Price} from "@/types/filters/price";
import {Color} from "@/types/filters/color";
import {Pattern} from "@/types/filters/pattern";
import {Style} from "@/types/filters/style";
import {Discount} from "@/types/filters/discount";
import {ProductWithDetails} from "@/types/product-details";


interface CatalogLayoutProps {
    children: React.ReactNode
    items: Category[]
    sizes: Size[]
    title: string
    noTitle?: boolean
    activeItem?: string
    brands: Brand[]
    category: string;
    price: Price[];
    colors: Color[];
    patterns: Pattern[];
    styles: Style[];
    products: ProductWithDetails[];
    discounts: Discount[];
}

export default function CatalogLayout({ children, items, title, noTitle, activeItem, brands, sizes, category, price, colors, patterns, styles, discounts, products}: CatalogLayoutProps) {
    return(
        <div className="flex flex-row gap-6 w-full">
            <aside className="sticky top-[57px] self-start  w-[290px] shrink-0">
                <Sidebar products={products} activeItem={activeItem} noTitle={noTitle} title={title} items={items}/>
            </aside>

            <div className="flex flex-col gap-8 w-full">
                <div className="sticky w-[100%] top-[57px] z-20 bg-white">
                    <FilterBar
                        patterns={patterns}
                        price={price}
                        category={category}
                        brands={brands}
                        sizes={sizes}
                        colors={colors}
                        styles={styles}
                        discounts={discounts}
                    />
                </div>
                {/* контент — обычный поток */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}