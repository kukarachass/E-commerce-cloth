'use client'

import {useEffect, useState} from "react";
import BrandInfoSvg from "@/components/ui/icons/BrandInfoSvg";
import CloseButtonSvg from "@/components/ui/buttons/CloseButtonSvg";
import Image from "next/image";

export default function InfoButton({brandName}: { brandName: string }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

    }, [open]);
    return (
        <>
            <div onClick={() => setOpen(!open)} className="flex flex-row gap-2 items-center">
                <BrandInfoSvg/>
                <span className="text-white text-[16px] font-[600]">Info</span>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20">
                    <div className='flex flex-col gap-4 rounded-[10px] bg-white w-full max-w-[600px] p-4'>
                        <div className='flex flex-row items-center relative'>
                            <h1 className="flex-1 text-center text-[var(--text)] text-[24px] font-bold">
                                About {brandName}
                            </h1>
                            <button className="absolute right-0 cursor-pointer" onClick={() => setOpen(false)}>
                                <CloseButtonSvg className="stroke-black"/>
                            </button>
                        </div>
                        <div className="relative w-full aspect-[16/5]">
                            <Image className="rounded" src={"/banners/model-banner.jpg"} alt={"fdsfsdfsf"} fill/>
                        </div>
                        <div className='text-[16px] text-[var(--muted)]'>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aperiam, aut, debitis excepturi laudantium non numquam obcaecati odio officiis quam quia saepe sapiente sequi, soluta tempora tenetur ullam voluptas. Voluptate.
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}