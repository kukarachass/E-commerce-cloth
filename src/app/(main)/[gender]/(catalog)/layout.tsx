import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CatalogLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col pt-4">
                <Breadcrumb className="pb-1"/>
                {children}
            </div>
        </div>

    )
}