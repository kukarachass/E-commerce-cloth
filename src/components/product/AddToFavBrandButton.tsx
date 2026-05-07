"use client"

import {useFavoriteBrandsStore} from "@/store/useFavoritesStore";
import FavAnimIcon from "@/components/ui/icons/FavIcon/FavAnimIcon";

export default function AddToFavBrandButton({ brandId }: {brandId: string}){
    const toggle = useFavoriteBrandsStore(s => s.toggle)
    const isFav = useFavoriteBrandsStore(s => s.items.includes(brandId))
    return(
        <div className="flex flex-row gap-2 items-center">
            <FavAnimIcon
                selected={isFav}
                onChange={() => toggle(brandId)}
            />
            <span className="text-[var(--text)] text-[16px] font-bold">Follow brand</span>
        </div>
    )
}

