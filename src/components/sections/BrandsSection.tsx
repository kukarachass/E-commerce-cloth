import ViewAllLink from "@/components/ui/ViewAllLink";
import Image from "next/image";
import Link from "next/link";
import {BrandsSectionData} from "@/types/homepage";
import {Gender} from "@/hooks/useGender";

interface BrandSectionProps {
    gender: Gender;
    brandData: BrandsSectionData
}

export default function BrandsSection({gender, brandData}: BrandSectionProps) {
    return (
        <div className="flex flex-col gap-4 w-full py-8 md:py-[64px]">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-[var(--text)] text-[20px] md:text-[24px] leading-[125%] font-[600]">{brandData.brandName}</h1>
                <ViewAllLink path={`/${gender}/brands`}/>
            </div>

            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/7] overflow-hidden rounded-[4px]">
                <Image
                    src={brandData.bannerUrl}
                    alt="Brands banner"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                <div className="flex flex-col gap-3 sm:gap-4 absolute bottom-6 sm:bottom-10 left-4 right-4 items-center z-10">
                    <Link
                        href={`/${gender}/brands/${brandData.brandSlug}`}
                        className="border py-2 px-6 sm:py-3 sm:px-8 border-white w-fit text-white text-[14px] sm:text-[16px] font-bold rounded-full text-center hover:bg-white hover:text-black transition-colors"
                    >
                        {brandData.ctaText}
                    </Link>
                    <div className="flex flex-wrap justify-center gap-2 items-center">
                        {brandData.badges.map((badge, index) => (
                            <span
                                key={index}
                                className="py-0.5 px-2 bg-white text-[var(--text)] text-[12px] sm:text-[14px] font-bold rounded text-center whitespace-nowrap"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}