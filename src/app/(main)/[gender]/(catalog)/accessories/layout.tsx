import {categoryItems} from "@/mocks/catalogStore";
import CatalogLayout from "@/components/catalog/CatalogLayout";

export default function AccessoriesLayout({children}: { children: React.ReactNode }) {
    const items = categoryItems.women.accessories;

    return(
        <CatalogLayout title={"Accessories"} items={items}>
            {children}
        </CatalogLayout>
    )
}