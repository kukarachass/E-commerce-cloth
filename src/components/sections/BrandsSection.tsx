import ViewAllLink from "@/components/ui/ViewAllLink";
import Image from "next/image";
import Link from "next/link";
import {useGenderStore} from "@/store/useGenderStore";

export default function BrandsSection() {
    const gender = useGenderStore(s => s.gender)
    const brand = "lk-bennet"
    return (
        <div className="flex flex-col gap-4 w-full py-[64px]">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-[var(--text)] text-[24px] leading-[125%] font-[600]">Brands</h1>
                <ViewAllLink path={"brands"}/>
            </div>

            <div className="relative w-full aspect-[16/7] rounded-lg overflow-hidden">
                <Image
                    src={"/banners/brand-banner-3.webp"}
                    alt="Brands banner"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className={"flex flex-col gap-4 absolute bottom-[100px] left-0 right-0 items-center"}>
                    <Link href={`/${gender}/brands/${brand}`}
                          className="border py-3 px-8 border-white w-fit text-white text-[16px] font-bold rounded-full">up
                        to 85% off</Link>
                    <div className="flex flex-row gap-2 items-center">
                        <span className="py-0.5 px-2 font-bold bg-white text-[#d0021b] rounded">sale</span>
                        <span className="py-0.5 px-2 bg-white text-[var(--text)] font-bold rounded">new items</span>
                    </div>
                </div>
                {/* затемнение поверх */}
            </div>
        </div>
    )
}