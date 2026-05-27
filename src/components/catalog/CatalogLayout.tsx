import FilterBar from "@/components/catalog/FilterBar";
import {Category} from "@/types/category";
import Sidebar from "@/components/catalog/sidebar/Sidebar";
import {Brand} from "@/types/brands";


interface CatalogLayoutProps {
    children: React.ReactNode
    items: Category[]
    title: string
    noTitle?: boolean
    activeItem?: string
    brands: Brand[]
}

export default function CatalogLayout({ children, items, title, noTitle, activeItem, brands }: CatalogLayoutProps) {
    return(
        <div className="flex flex-row gap-6 w-full">
            <aside className="sticky top-[57px] self-start  w-[290px] shrink-0">
                <Sidebar activeItem={activeItem} noTitle={noTitle} title={title} items={items}/>
            </aside>

            <div className="flex flex-col gap-8 w-full">
                <div className="sticky w-[100%] top-[57px] z-20 bg-white">
                    <FilterBar brands={brands}/>
                </div>
                {/* контент — обычный поток */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}