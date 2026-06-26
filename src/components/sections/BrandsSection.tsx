import ViewAllLink from "@/components/ui/ViewAllLink";
import Image from "next/image";
import Link from "next/link";
import {BrandsSectionData} from "@/types/homepage";
import {Gender} from "@/hooks/useGender";

interface BrandSectionProps{
    gender: Gender;
    brandData: BrandsSectionData
}

export default function BrandsSection({ gender, brandData }: BrandSectionProps) {
    return (
        <div className="flex flex-col gap-4 w-full py-[64px]">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-[var(--text)] text-[24px] leading-[125%] font-[600]">{brandData.brandName}</h1>
                <ViewAllLink path={`/${gender}/brands`}/>
            </div>

            <div className="relative w-full aspect-[16/7] overflow-hidden">
                <Image
                    src={brandData.bannerUrl}
                    alt="Brands banner"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover rounded-[4px]"
                />
                <div className={"flex flex-col gap-4 absolute bottom-[100px] left-0 right-0 items-center"}>
                    <Link href={`/${gender}/brands/${brandData.brandSlug}`}
                          className="border py-3 px-8 border-white w-fit text-white text-[16px] font-bold rounded-full">{brandData.ctaText}</Link>
                    <div className="flex flex-row gap-2 items-center">
                        {brandData.badges.map((badge, index) => (
                            <span key={index} className="py-0.5 px-2 bg-white text-[var(--text)] font-bold rounded">{badge}</span>
                        ))}
                    </div>
                </div>
                {/* затемнение поверх */}
            </div>
        </div>
    )
}