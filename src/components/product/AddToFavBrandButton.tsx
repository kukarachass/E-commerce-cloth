"use client"

import {useFavoriteBrandsStore} from "@/store/useFavoritesStore";
import FavAnimIcon from "@/components/ui/icons/FavIcon/FavAnimIcon";
import FavIcon from "@/components/ui/icons/FavIcon";

interface AddToFavBrandButtonProps {
    brandId: string;
    className?: string;
    type?: "single" | "text";
}

export default function AddToFavBrandButton({brandId, className, type = "text"}: AddToFavBrandButtonProps) {
    const toggle = useFavoriteBrandsStore(s => s.toggle)
    const isFav = useFavoriteBrandsStore(s => s.items.includes(brandId))

    return (
        <>
            {type === "text" ? (
                <div className={`${className} flex flex-row gap-2 items-center select-none `}>
                    <FavAnimIcon
                        selected={isFav}
                        onChange={() => toggle(brandId)}
                    />
                    <span className="text-[var(--text)] text-[16px] font-bold">Follow brand</span>
                </div>
            ): (
                <FavIcon
                    className={`${className} select-none `}
                    onChange={() => toggle(brandId)}
                    isFav={isFav}
                />
            )}
        </>
    )
}

