import {categoryItems} from "@/mocks/catalogStore";
import CatalogLayout from "@/components/catalog/CatalogLayout";

export default function SportswearLayout({children}: { children: React.ReactNode }) {
    const items = categoryItems.women.sportswear;

    return(
        <CatalogLayout title={"Sportswear"} items={items}>
            {children}
        </CatalogLayout>
    )
}