"use client"

import Image from "next/image";
import {useRouter} from "next/navigation";

export default function ReturnsButton(){
    const router = useRouter();
    return(
        <div onClick={() => router.push("/account/returns")}
             className="flex flex-row items-center gap-4 py-4 border-b border-gray-300 cursor-pointer">
            <Image src={"/return-arrow.svg"} width={20} height={20} alt={"return"} className="w-[20px] h-[20px]"/>
            <span className="text-[16px] text-[#666]">Create a Return</span>
        </div>
    )
}