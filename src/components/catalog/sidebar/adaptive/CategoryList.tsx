"use client"

import { Category } from "@/types/filters/category"
import SidebarItem from "@/components/catalog/sidebar/SidebarItem"

export default function CategoryList({ items }: { items: Category[] }) {
    return (
        <div className="flex flex-col">
            {items.map(item => (
                <SidebarItem key={item.id} item={item} />
            ))}
        </div>
    )
}