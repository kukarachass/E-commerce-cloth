"use client"

import {useRouter} from "next/navigation";
import InfoSvg from "@/components/ui/icons/InfoSvg";

export default function CustomerServiceButton(){
    const router = useRouter();
    return(
        <div onClick={() => router.push("/account/customer-service")}
             className="flex flex-row items-center gap-4 py-4 border-b border-gray-300 cursor-pointer">
            <InfoSvg className="w-[20px] h-[20px]"/>
            <span className="text-[16px] text-[#666]">Customer Service</span>
        </div>
    )
}