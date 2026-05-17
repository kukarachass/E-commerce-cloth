"use client"

import CartIconSvg from "@/components/ui/icons/CartIconSvg";
import {useRouter} from "next/navigation";

export default function MyOrdersButton(){
    const router = useRouter();

    return(
        <div onClick={() => router.push("/account/my-orders")} className="flex flex-row items-center gap-4 py-4 border-b border-gray-300 cursor-pointer">
            <CartIconSvg className="w-[20px] h-[20px]"/>
            <span className="text-[16px] text-[#666]">My orders</span>
        </div>
    )
}