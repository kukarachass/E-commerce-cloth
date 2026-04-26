import Link from "next/link";

export default function HeaderNav(){
    return(
        <div className="flex flex-row gap-6 items-center">
            <Link href={"/new-items"}>
                New Items
            </Link>
            <Link href={"/brands"}>
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