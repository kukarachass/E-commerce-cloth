"use client"

import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import {useRouter} from "next/navigation";
import {useGender} from "@/hooks/useGender";

interface Props {
    pageName: string;
}
export default function EmptyPage({ pageName }: Props){
    const router = useRouter()
    const gender = useGender();
    return(
        <div className="flex flex-col gap-2 items-center mx-auto justify-center py-10">
            <span className="text-[24px] text-[var(--text)] font-[600]">No {pageName} yet</span>
            <ButtonPrimary onClick={() => router.push(`/${gender}`)} className="text-[16px] font-bold" variant={"primary"}>
                Shop now
            </ButtonPrimary>
        </div>
    )
}