import Sidebar, {CategoryItem} from "@/components/catalog/Sidebar";
import FilterBar from "@/components/catalog/FilterBar";

interface CatalogLayoutProps {
    children: React.ReactNode;
    items: readonly CategoryItem[]
    title: string;
    noTitle?: boolean;
    activeItem?: string;
}
export default function CatalogLayout({ children, items, title, noTitle, activeItem }: CatalogLayoutProps) {
    return(
        <div className="flex flex-row gap-6 w-full">
            <aside className="sticky top-[57px] self-start  w-[290px] shrink-0">
                <Sidebar activeItem={activeItem} noTitle={noTitle} title={title} items={items}/>
            </aside>

            <div className="flex flex-col gap-8 w-full">
                <div className="sticky w-[100%] top-[57px] z-20 bg-white">
                    <FilterBar/>
                </div>
                {/* контент — обычный поток */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}