import {categoryItems} from "@/mocks/catalogStore";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import {ReactNode} from "react";

interface CategoryLayoutProps {
    children: ReactNode;
    params: Promise<{ gender: string; category: string }>
}

export default async function CategoryLayout({ children, params }: CategoryLayoutProps) {
    const { gender, category } = await params;

    const items = categoryItems.women.clothing.filter(c => c.name === category)
    return (
        <CatalogLayout activeItem={category} noTitle title={category} items={items}>
            {children}
        </CatalogLayout>
    )
}