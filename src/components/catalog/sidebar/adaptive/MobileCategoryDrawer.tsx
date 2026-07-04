"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Category } from "@/types/filters/category"
import { ProductWithDetails } from "@/types/product-details"
import CategoryHeader from "@/components/catalog/sidebar/adaptive/CategoryHeader";
import {useCatalogSidebarStore} from "@/store/adaptive/catalog/useCatalogSidebarStore";
import CategoryList from "@/components/catalog/sidebar/adaptive/CategoryList";
import {useGetCategoryByProductIds} from "@/hooks/category/useGetCategoryByProductIds";

interface Props {
    title: string
    items: Category[]
    products: ProductWithDetails[]
}

export default function MobileCategoryDrawer({ title, items, products }: Props) {
    const isOpen = useCatalogSidebarStore(state => state.isOpen)
    const setOpen = useCatalogSidebarStore(state => state.setOpen)
    const handleClose = () => setOpen(false)
    const productIds = products.map(p => p.id);

    const { data: categoryItems } = useGetCategoryByProductIds(productIds)
    const catItems = items.length <= 0 ? categoryItems ?? [] : items
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="category-drawer-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 z-50 lg:hidden"
                        onClick={handleClose}
                    />

                    <motion.aside
                        key="category-drawer"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-y-0 left-0 max-w-[320px] sm:max-w-[380px] w-full bg-white border-r border-neutral-200 z-[51] flex flex-col lg:hidden"
                        aria-label="Categories"
                    >
                        <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4 border-b border-neutral-100">
                            <CategoryHeader title={title} resultCount={products.length} />
                            <button
                                onClick={handleClose}
                                aria-label="Close"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 transition-colors shrink-0"
                            >
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 3L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-3 py-3">
                            <CategoryList items={catItems} />
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}