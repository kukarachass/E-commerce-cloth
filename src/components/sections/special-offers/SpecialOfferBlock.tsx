"use client"

import Image from "next/image";
import CountdownTimer from "@/components/ui/CountdownTimer";
import {SpecialOfferData} from "@/types/homepage";
import {useRouter} from "next/navigation";

export default function SpecialOfferBlock({offer}: { offer: SpecialOfferData }) {
    const router = useRouter();
    return (
        <div
            onClick={() => router.push(offer.link)}
            className="flex flex-col gap-4 w-full rounded-lg border border-transparent hover:border-gray-100 transition-colors duration-200 cursor-pointer">
            <div className="w-full aspect-[16/9] relative rounded">
                <Image src={offer.imageUrl} alt={"off"} fill className="rounded"/>
            </div>
            <div className="flex flex-col px-2">
                <span className="text-[var(--text)] text-[20px] leading-[120%] font-bold">{offer.title}</span>
                <span className="text-[var(--text)] text-[16px] leading-[120%]">{offer.subtitle}</span>
                {offer.dealEnd && (
                    <div className="flex flex-row items-center gap-2">
                        <span className="text-[var(--text)] text-[16px] leading-[150%]">Ends in</span>
                        <CountdownTimer targetDate={offer.dealEnd}/>
                    </div>
                )}
            </div>
        </div>
    )
}