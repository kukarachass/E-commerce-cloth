"use client"

import Link from "next/link";
import {useParams, usePathname} from "next/navigation";

export default function HeaderNav(){
    const pathname = usePathname()
    const gender = pathname.split("/")[1] // "women" или "men"

    return(
        <div className="flex flex-row gap-6 items-center">
            <Link href={`/${gender}/new-items`}>
                New Items
            </Link>
            <Link href={`/${gender}/brands`}>
            Brands
            </Link>
            <Link href={"/clothing"}>
                Clothing
            </Link>

            <Link href={"/sportswear"}>
                Sportswear
            </Link>
            <Link href={"/shoes"}>
                Shoes
            </Link>
            <Link href={"/accessories"}>
                Accessories
            </Link>
        </div>
    )
}