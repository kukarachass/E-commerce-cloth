import Breadcrumb from "@/components/ui/Breadcrumb";
import Container from "@/components/layout/Сontainer";

export default function CatalogLayout({children}: { children: React.ReactNode }) {
    return (
        <Container>
            <div className="flex flex-col pt-4">
                <Breadcrumb className="pb-1 px-4 xl:px-0"/>
                {children}
            </div>
        </Container>

    )
}