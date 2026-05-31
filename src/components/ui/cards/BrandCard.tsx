import Image from "next/image";
import AddToFavButton from "@/components/favourites/AddToFavButton";
import {IBrand} from "@/types/IBrand";

interface Props{
    brand: IBrand;
    variant: "wide" | "default"
}

export default function BrandCard({ brand, variant }: Props){
    return(
        <div key={brand.id} className={`flex flex-col gap-3 border border-gray-200 rounded-md ${variant === "wide" ? "w-[350px]" : "w-full"}`}>
            <div className={`relative h-[210px] ${variant === "wide" ? "w-[350px]" : "w-full"}`}>
                <Image src={brand.logo ?? "/placeholder.jpg"} alt={brand.id} fill className="object-cover rounded-md"/>
                <AddToFavButton className={"absolute right-[10px] top-[10px]"} id={brand.id} type={"brand"}/>
            </div>
            <div className="flex flex-col gap-1 px-4 pb-2">
                <div className="flex flex-row gap-1">
                    {brand.tags.map(t => (
                        <span key={t} className={`bg-white shadow px-1 rounded text-[12px] leading-[133%] font-[600] capitalize text-[]`}>{t}</span>
                    ))}
                </div>
                <span className="text-[var(--text)] text-[16px] leading-[150%] font-[600]">up to {brand.maxDiscount}% off</span>
            </div>
        </div>
    )
}