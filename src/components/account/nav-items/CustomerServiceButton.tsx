"use client"

import {useRouter} from "next/navigation";
import InfoSvg from "@/components/ui/icons/InfoSvg";

export default function CustomerServiceButton(){
    const router = useRouter();
    return(
        <div onClick={() => router.push("/account/customer-service")}
             className="border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-all duration-200">
            <div className="flex px-4 flex-row items-center gap-4 py-4">
                <InfoSvg className="w-[20px] h-[20px]"/>
                <span className="text-[16px] text-[#666]">Customer Service</span>
            </div>
        </div>
    )
}