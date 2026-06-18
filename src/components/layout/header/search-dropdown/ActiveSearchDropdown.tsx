"use client"

import {SearchResult} from "@/actions/search/search";
import Link from "next/link";
import SearchProductCard from "@/components/product/SearchProductCard";
import {useSearchStore} from "@/store/useSearchOpen";
import {useGenderStore} from "@/store/useGenderStore";

interface ActiveSearchDropwdownProps {
    data: SearchResult | undefined;
    query: string;
}

export default function ActiveSearchDropwdown({data, query}: ActiveSearchDropwdownProps) {
    const setSearchOpen = useSearchStore(state => state.setSearchOpen);
    const gender = useGenderStore(s => s.gender);

    const hasBrands = (data?.brands?.length ?? 0) > 0
    const hasProducts = (data?.products?.length ?? 0) > 0
    const hasCategories = (data?.categories?.length ?? 0) > 0
    const hasCollections = (data?.collections?.length ?? 0) > 0

    // EMPTY
    if (!hasBrands && !hasProducts) {
        return (
            <div className="py-6">
                <p className="text-sm text-gray-500">
                    No results found for the {query}
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-[50vh] flex flex-col gap-4">
            {/* Секция: подсказки брендов */}
            {hasBrands && (
                <div className="">
                    {data!.brands.map((b) => (
                        <Link
                            onClick={() => setSearchOpen(false)}
                            key={b.id}
                            href={`/${gender}/brands/${b.slug}`}
                            className="block rounded px-2 py-1.5 text-sm hover:bg-gray-50"
                        >
                            <span className="font-semibold">{b.name}</span>
                            <span className="text-gray-400"> — Brand</span>
                        </Link>
                    ))}
                </div>
            )}
            {hasCategories && (
                <div>
                    {data!.categories.map((c) => (
                        <Link
                            onClick={() => setSearchOpen(false)}
                            key={c.id}
                            href={c.href}
                            className="block rounded px-2 py-1.5 text-sm hover:bg-gray-50"
                        >
                            <span className="font-semibold">{c.name}</span>
                            <span className="text-gray-400"> — Categories</span>
                        </Link>
                    ))}
                </div>
            )}
            {hasCollections && (
                <div className="">
                    {data!.collections.map((c) => (
                        <Link
                            onClick={() => setSearchOpen(false)}
                            key={c.id}
                            href={`/${gender}/collections/${c.slug}`}
                            className="block rounded px-2 py-1.5 text-sm hover:bg-gray-50"
                        >
                            <span className="font-semibold">{c.slug}</span>
                            <span className="text-gray-400"> — Collection</span>
                        </Link>
                    ))}
                </div>
            )}

            {/* Секция: товары */}
            {hasProducts && (
                <div className="w-full pb-6">
                    <div className="flex flex-row items-center justify-between">
                        <span className="mb-2 text-[12px] font-semibold uppercase text-gray-400">Products</span>
                        <span className="mb-2 text-[12px] font-semibold uppercase text-gray-400 underline">Show {data?.products.length} results</span>
                    </div>
                    <div className="grid grid-cols-6 gap-3">
                        {data!.products.slice(0, 6).map((p) => (
                            <Link
                                key={p.id}
                                href={`/product/${p.slug}`}
                                className="group"
                                onClick={() => setSearchOpen(false)}
                            >
                                <SearchProductCard product={p}/>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}