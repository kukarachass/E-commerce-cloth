import {categoryItems} from "@/mocks/catalogStore";
import CatalogLayout from "@/components/catalog/CatalogLayout";

export default function ShoesLayout({children}: { children: React.ReactNode }) {
    const items = categoryItems.women.shoes;

    return(
        <CatalogLayout title={"Shoes"} items={items}>
            {children}
        </CatalogLayout>
    )
}