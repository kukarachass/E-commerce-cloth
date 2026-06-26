"use client"

import Image from "next/image";
import cn from "classnames";
import AddToFavButton from "@/components/favourites/AddToFavButton";
import {IBrand} from "@/types/IBrand";
import {usePathname, useRouter} from "next/navigation";
import {useGender} from "@/hooks/useGender";

interface Props {
    brand: IBrand;
    variant: "wide" | "default";
}

export default function BrandCard({ brand, variant }: Props) {
    const router = useRouter();
    const gender = useGender();

    return (
        <div onClick={() => router.push(`${gender}/brands/${brand.slug}`)} className="group flex w-full flex-col gap-3 rounded-lg border border-transparent p-2 transition-colors duration-200 hover:border-gray-100 cursor-pointer">
            <div className={cn(
                "relative w-full overflow-hidden rounded-md bg-gray-50",
                variant === "wide" ? "aspect-[21/9]" : "aspect-[3/2]"
            )}>
                <Image
                    src={brand.imageUrl}
                    alt={brand.name}
                    fill
                    className="object-cover transition-transform rounded-[4px] duration-500 ease-out group-hover:scale-[1.04]"
                />
                <AddToFavButton
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-transform duration-200 hover:scale-105"
                    id={brand.id}
                    type="brand"
                />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex flex-row flex-wrap gap-1.5">
                    {brand.tags.map((t, index) => {
                        const isSale = t.toLowerCase() === "sale";
                        return (
                            <span
                                key={index}
                                className={cn(
                                    "rounded-[10px] border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em]",
                                    isSale
                                        ? "border-black bg-black text-white"
                                        : "border-black/15 text-[var(--text)]"
                                )}
                            >
                                {t}
                            </span>
                        );
                    })}
                </div>
                <span className="text-[17px] font-semibold leading-[140%] text-[var(--text)]">
                    {brand.promoDetailsText}
                </span>
            </div>
        </div>
    )
}