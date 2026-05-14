"use client"

import {useFavoritesStore} from "@/store/useFavoritesStore";
import FavAnimIcon from "@/components/ui/icons/FavIcon/FavAnimIcon";

export default function AddToFavButton({productId}: {productId: string}){
    const toggle = useFavoritesStore(s => s.toggle)
    const isFav = useFavoritesStore(s => s.items.includes(productId))
    return(
        <div className="flex items-center p-3 border border-[#ccc] rounded-[10px]">
            <FavAnimIcon
                selected={isFav}
                onChange={() => toggle(productId)}
            />
        </div>
    )
}