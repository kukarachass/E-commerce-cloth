import {useGenderStore} from "@/store/useGenderStore";
import Link from "next/link";
import Image from "next/image";
import ViewAllLink from "@/components/ui/ViewAllLink";

const categories = [
    { id: "1", name: "Dresses", url: "/category/dress.jpg"},
    { id: "2", name: "Jeans", url: "/category/jeans.jpg"},
    { id: "3", name: "T-Shirts", url: "/category/tops.png"},

    { id: "4", name: "Trainers", url: "/category/sneak.png"},
    { id: "5", name: "Bags", url: "/category/bags.png"},
    { id: "6", name: "Sportswear", url: "/category/sports.png"}
]

export default function PopularCategories(){
    const gender = useGenderStore(s => s.gender)

    return(
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-row justify-between">
                <h1 className="text-[var(--text)] leading-[125%] text-[24px] font-bold">Popular categories</h1>
                <ViewAllLink path={"categories"}/>
            </div>
            <div className="flex flex-row justify-between">
                {categories.map((category) => (
                    <Link href={`/${gender}/${category.name}`} key={category.id} className="flex flex-col gap-2">
                        <div className="w-[160px] h-[130px] relative">
                            <Image src={category.url} alt={category.name} fill/>
                        </div>
                        <span className="text-[var(--text)] text-[16px] text-center font-[600]">{category.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}