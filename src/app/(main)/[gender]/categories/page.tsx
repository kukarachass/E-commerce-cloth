import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function () {
    const data = [
        {name: "Bags", img: "/category/bags.png"},
        {name: "Dresses", img: "/category/dress.jpg"},
        {name: "Jeans", img: "/category/jeans.jpg"},
        {name: "Trainers", img: "/category/sneak.png"},
        {name: "Sportswear", img: "/category/sports.png"},
        {name: "T-Shirts", img: "/category/tops.png"},

    ]

    return (
        <div className="flex flex-col py-6 gap-6 max-w-[1200px] mx-auto justify-center">
            <Breadcrumb/>
            <h1 className="text-[var(--text)] font-bold text-[28px]">ALL CATEGORIES</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.map((category) => (
                    <div key={category.name} className="flex flex-col gap-3 cursor-pointer bg-[#f9f9f9] p-4 max-w-[330px] max-h-[300px]">
                        <Image
                            src={category.img}
                            alt={category.name}
                            width={300}
                            height={230}
                            className="transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="text-center font-bold text-[18px] text-[var(--text)]">
                        {category.name}
                    </span>
                    </div>
                ))}
            </div>
        </div>

    )
}