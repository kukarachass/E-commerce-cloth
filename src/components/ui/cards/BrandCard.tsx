import Image from "next/image";
import AddToFavBrandButton from "@/components/product/AddToFavBrandButton";

interface BrandTag{
    id: string;
    name: string;
    color: string;

}
interface IBrand{
    id: string;
    imgUrl: string;
    tags: BrandTag[];
    discount?: number
}

interface Props{
    brand: IBrand;
}

export default function BrandCard({ brand }: Props){
    return(
        <div key={brand.id} className="flex flex-col gap-3 border border-gray-200 rounded-md">
            <div className="relative h-[210px] w-full">
                <Image src={brand.imgUrl} alt={brand.id} fill className="object-cover rounded-md"/>
                <AddToFavBrandButton type={"single"} className="absolute right-[5px] top-[5px] z-10" brandId={brand.id}/>
            </div>
            <div className="flex flex-col gap-1 px-4 pb-2">
                <div className="flex flex-row gap-1">
                    {brand.tags.map(t => (
                        <span key={t.id} className={`bg-white shadow px-1 rounded text-[12px] leading-[133%] font-[600] capitalize text-[${t.color}]`}>{t.name}</span>
                    ))}
                </div>
                <span className="text-[var(--text)] text-[16px] leading-[150%] font-[600]">up to {brand.discount}% off</span>
            </div>
        </div>
    )
}