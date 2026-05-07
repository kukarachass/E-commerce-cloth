"use client"

import Link from "next/link";
import {useParams, usePathname, useRouter} from "next/navigation";
import {useGenderStore} from "@/store/useGenderStore";

export default function HeaderNav(){
    const gender = useGenderStore(s => s.gender);

    return(
        <div className="flex flex-row gap-6 items-center">
            <Link href={`/${gender}/new-items`}>
                New items
            </Link>
            <Link href={`/${gender}/brands`}>
            Brands
            </Link>
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