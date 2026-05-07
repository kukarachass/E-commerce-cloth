import FilterBar from "@/components/catalog/FilterBar";
import Sidebar from "@/components/catalog/Sidebar";
import {categoryItems} from "@/mocks/catalogStore";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CatalogLayout({children}: { children: React.ReactNode }) {
    const items = categoryItems.women.clothing;
    return (
        <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col pt-4">
                <Breadcrumb/>
                <div className="flex flex-row gap-6 w-full">
                    <aside className="sticky self-start top-[57px] h-[calc(100vh-113px)] overflow-y-auto w-[290px] shrink-0">
                        <Sidebar title={"Clothing"} items={items}/>
                    </aside>

                    <div className="flex flex-col gap-8 w-full">
                        <div className="sticky top-[57px] z-40 bg-white">
                            <FilterBar/>
                        </div>
                        {/* контент — обычный поток */}
                        <main className="flex-1">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>

    )
}