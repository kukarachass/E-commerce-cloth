import {categoryItems} from "@/mocks/catalogStore";
import CatalogLayout from "@/components/catalog/CatalogLayout";

export default function ClothingLayout({children}: { children: React.ReactNode }) {
    const items = categoryItems.women.clothing;

    return(
        <CatalogLayout title={"Clothing"} items={items}>
            {children}
        </CatalogLayout>
    )
}