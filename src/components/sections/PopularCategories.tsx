"use client"

import Link from "next/link";
import Image from "next/image";
import ViewAllLink from "@/components/ui/ViewAllLink";
import {Gender} from "@/hooks/useGender";



export default function PopularCategories({ gender }: { gender: Gender }) {

    const womenCat = [
        { id: "1", name: "Dresses", url: "/pop-cat/women/dress.jpg", href: `/women/clothing/dresses`},
        { id: "2", name: "Jeans", url: "/pop-cat/women/jeans.jpg", href: `/women/clothing/jeans`},
        { id: "3", name: "T-Shirts", url: "/pop-cat/women/tops.png", href: `/women/clothing/shirts-and-tops`},

        { id: "4", name: "Trainers", url: "/pop-cat/women/sneak.png", href: `/women/shoes/trainers`},
        { id: "5", name: "Bags", url: "/pop-cat/women/bags.png", href: `/women/accessories/bags`},
        { id: "6", name: "Sportswear", url: "/pop-cat/women/sports.png", href: `/women/sportswear`}
    ]

    const menCat = [
        { id: "1", name: "T-shirts", url: "/pop-cat/men/pop-cat-t-shirt.png", href: `/men/clothing/t-shirts-and-polos`},
        { id: "2", name: "Jeans", url: "/pop-cat/men/pop-cat-jeans.png", href: `/men/clothing/jeans`},
        { id: "3", name: "Trainers", url: "/pop-cat/men/pop-cat-trainers.png", href: `/men/shoes/trainers`},

        { id: "4", name: "Jackets", url: "/pop-cat/men/pop-cat-jackets.jpg", href: `/men/clothing/jackets`},
        { id: "5", name: "Shirts", url: "/pop-cat/men/pop-cat-shirts.png", href: `/men/clothing/shirts`},
        { id: "6", name: "Sports Clothing & Apparel", url: "/pop-cat/men/pop-cat-sports.png", href: `/men/sportswear`}
    ]

    const categories = gender === "men" ? menCat : womenCat

    return(
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-row justify-between">
                <h1 className="text-[var(--text)] leading-[125%] text-[24px] font-bold">Popular categories</h1>
                <ViewAllLink path={`/${gender}/categories`}/>
            </div>
            <div className="flex flex-row justify-between">
                {categories.map((category) => (
                    <Link href={category.href} key={category.id} className="flex flex-col gap-2">
                        <div className="w-[160px] h-[130px] relative">
                            <Image src={category.url} alt={category.name} className="rounded-[4px]" fill/>
                        </div>
                        <span className="text-[var(--text)] text-[16px] text-center font-[600]">{category.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}