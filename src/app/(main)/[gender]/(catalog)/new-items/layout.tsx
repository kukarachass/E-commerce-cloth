import {categoryItems} from "@/mocks/catalogStore";
import CatalogLayout from "@/components/catalog/CatalogLayout";

export default function NewItemsLayout({children}: { children: React.ReactNode }) {
    // NewItemsLayout.tsx
    const items = Object.entries(categoryItems.women).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1), // "clothing" → "Clothing"
        subcategories: value.map(v => v.name)
    }))

    return(
        <CatalogLayout noTitle title={"New Arrivals"} items={items}>
            {children}
        </CatalogLayout>
    )
}