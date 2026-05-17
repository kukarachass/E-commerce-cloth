"use client"

import Image from "next/image";

export default function LogOutButton(){
    return(
        <div
             className="flex flex-row items-center gap-4 py-4 border-b border-gray-300 cursor-pointer">
            <Image src={"/log-out.svg"} alt={"logout"} width={20} height={20}/>
            <span className="text-[16px] text-[#666]">Log out</span>
        </div>
    )
}