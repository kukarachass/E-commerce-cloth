"use client"

import Link from "next/link";
import {useGenderStore} from "@/store/useGenderStore";
import {useCollections} from "@/hooks/useCollections";
import {useState} from "react";


export default function HeaderNav(){
    const gender = useGenderStore(s => s.gender)
    const { data: collections = [] } = useCollections()

    return(
        <div className="flex flex-row gap-8 items-center text-[var(--text)] text-[16px] capitalize">
            <Link href={`/${gender}/new-items`}>
                New items
            </Link>
            <Link href={`/${gender}/brands`}>
                Brands
            </Link>
            {collections.map((c) => (
                <div key={c.id} className="flex flex-row gap-8">
                    <Link href={`/${gender}/collections/${c.slug}`}>
                        {c.title}
                    </Link>
                </div>
            ))}
            <Link href={`/${gender}/clothing`}>
                Clothing
            </Link>
            <Link href={`/${gender}/sportswear`}>
                Sportswear
            </Link>
            <Link href={`/${gender}/shoes`}>
                Shoes
            </Link>
            <Link href={`/${gender}/accessories`}>
                Accessories
            </Link>
        </div>
    )
}