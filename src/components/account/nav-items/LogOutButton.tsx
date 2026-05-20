"use client"

import Image from "next/image";

export default function LogOutButton(){
    return(
        <div
            className="cursor-pointer border-b border-gray-200 hover:bg-gray-100 transition-all duration-200">
            <div className="flex px-4 flex-row items-center gap-4 py-4">
                <Image src={"/log-out.svg"} alt={"logout"} width={20} height={20}/>
                <span className="text-[16px] text-[#666]">Log out</span>
            </div>
        </div>
    )
}