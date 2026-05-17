"use client"

import {useRouter} from "next/navigation";
import ProfileIconSvg from "@/components/ui/icons/ProfileIconSvg";

export default function MyProfileButton(){
    const router = useRouter();
    return(
        <div onClick={() => router.push("/account/my-profile")}
             className="flex flex-row items-center gap-4 py-4 border-b border-gray-300 cursor-pointer">
            <ProfileIconSvg className="w-[20px] h-[20px]"/>
            <span className="text-[16px] text-[#666]">My Profile</span>
        </div>
    )
}