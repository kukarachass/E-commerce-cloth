"use client"


import {useRouter} from "next/navigation";
import cn from "classnames";
import {useGenderStore} from "@/store/useGenderStore";

export default function GenderSwitcher(){
    const router = useRouter();
    const setGender = useGenderStore(state => state.setGender)
    const gender = useGenderStore(state => state.gender)


    const handleGender = (gender: "women" | "men") => {
        setGender(gender);
        router.push(`/${gender}`);
    }

    return(
        <div className="flex flex-row items-center gap-4">
            <button className={cn("text-[16px] cursor-pointer font-bold", {
                ["text-black border-b"]: gender === "women",
                ["text-[#999]"]: gender !== "women",
            })} onClick={() => handleGender("women")}>Women</button>
            <button className={cn("text-[16px] cursor-pointer font-bold",{
                ["text-black border-b"]: gender === "men",
                ["text-[#999]"]: gender !== "men",
            })} onClick={() => handleGender("men")}>Man</button>
        </div>
    )
}