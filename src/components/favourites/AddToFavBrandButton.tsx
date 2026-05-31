"use client"

import {useFavoriteBrandsStore} from "@/store/useFavoritesStore";
import FavAnimIcon from "@/components/ui/icons/FavIcon/FavAnimIcon";
import FavIcon from "@/components/ui/icons/FavIcon";
import cn from "classnames";

interface AddToFavBrandButtonProps {
    brandId: string;
    className?: string;
    type?: "single" | "text";
    color?: "default" | "white";
}

export default function AddToFavBrandButton({
                                                brandId,
                                                className,
                                                type = "text",
                                                color = "white"
                                            }: AddToFavBrandButtonProps) {
    const toggle = useFavoriteBrandsStore(s => s.toggle)
    const isFav = useFavoriteBrandsStore(s => s.items.includes(brandId))

    return (
        <div className={`${className} flex flex-row gap-2 items-center select-none`}>
            <FavIcon
                className={`select-none rounded-full p-1.5 transition-colors duration-200 ${
                    color === "white"
                        ? "hover:bg-white/20"
                        : "hover:bg-black/10"
                }`}
                onChange={() => toggle(brandId)}
                isFav={isFav}
                color={color}
            />
            {type === "text" && (
                <span className={cn("text-[16px] font-[600]",{
                    ["text-[var(--text)]"]: color === "default",
                    ["text-white"]: color === "white"
                })}>Follow</span>
            )}
        </div>
    )
}