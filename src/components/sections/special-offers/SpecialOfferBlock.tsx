import Image from "next/image";
import CountdownTimer from "@/components/ui/CountdownTimer";

export default function SpecialOfferBlock(){
    const DEAL_END = new Date(Date.now() + 7 * 60 * 60 * 1000 + 21 * 60 * 1000 + 41 * 1000);

    return(
        <div className="flex flex-col gap-4 w-full rounded-lg border border-transparent hover:border-gray-100 transition-colors duration-200 cursor-pointer">
            <div className="w-full aspect-[16/9] relative rounded">
                <Image src={"/spec-offers/spec-offer.png"} alt={"off"} fill className="rounded"/>
            </div>
            <div className="flex flex-col px-2">
                <span className="text-[var(--text)] text-[20px] leading-[120%] font-[400]">10% extra off. Code O-DEAL.</span>
                <div className="flex flex-row items-center gap-2">
                    <span className="text-[var(--text)] text-[16px] leading-[150%]">Ends in</span>
                    <CountdownTimer targetDate={DEAL_END}/>
                </div>
            </div>
        </div>
    )
}