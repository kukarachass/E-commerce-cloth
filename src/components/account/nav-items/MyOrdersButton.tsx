"use client"

import CartIconSvg from "@/components/ui/icons/CartIconSvg";
import {useRouter} from "next/navigation";

export default function MyOrdersButton(){
    const router = useRouter();

    return(
        <div onClick={() => router.push("/account/my-orders")}
             className="border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-all duration-200">
            <div className="flex px-4 flex-row items-center gap-4 py-4">
                <CartIconSvg className="w-[20px] h-[20px]"/>
                <span className="text-[16px] text-[#666]">My orders</span>
            </div>
        </div>
    )
}