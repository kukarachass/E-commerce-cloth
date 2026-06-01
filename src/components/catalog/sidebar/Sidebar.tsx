"use client"

import { Category } from "@/types/filters/category"
import { IProduct } from "@/components/product/IProduct"
import SidebarItem from "@/components/catalog/sidebar/SidebarItem";
import {ProductWithDetails} from "@/types/product-details";

interface Props {
    title: string
    items: Category[]
    noTitle?: boolean
    activeItem?: string
    products: ProductWithDetails[]
}

export default function Sidebar({ title, items, products }: Props) {
    return (
        <div className="flex flex-col gap-4 pb-6">
            <div className="flex flex-row gap-4 pt-6 pb-3 max-h-[75px]">
                <h1 className="text-[var(--text)] text-[24px] leading-[133%] font-bold">{title}</h1>
                <span className="flex items-center text-[var(--text)] font-[600] text-[13px] bg-[#f0f0f0] rounded-[16px] px-2">
                    {products.length} results
                </span>
            </div>
            <div className="flex flex-col overflow-y-auto h-[calc(100vh-113px)]">
                {items.map(item => (
                    <SidebarItem key={item.id} item={item}/>
                ))}
            </div>
        </div>
    )
}