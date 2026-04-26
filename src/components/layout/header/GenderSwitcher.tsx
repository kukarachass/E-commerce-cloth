"use client"


import {useRouter} from "next/navigation";

export default function GenderSwitcher(){
    const router = useRouter();
    return(
        <div className="flex flex-row items-center gap-4">
            <button onClick={() => router.push("/men")}>Man</button>
            <button onClick={() => router.push("/women")}>Women</button>
        </div>
    )
}