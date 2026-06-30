"use client"

import {useRouter} from "next/navigation"
import {useStickyStore} from "@/store/useStickyStore"
import {useSearchStore} from "@/store/useSearchOpen"
import {Player} from "@lordicon/react"
import {useRef, useState} from "react"

import searchJson from "./search.json"
import accountJson from "./account.json"
import favJson from "./fav.json"
import cartJson from "./cart.json"
import AccountActionsModal from "@/components/account/AccountActionsModal";
import useFavouriteProducts from "@/hooks/fav/useFavouriteProducts";
import useFavouriteBrands from "@/hooks/fav/useFavouriteBrands";
import {useGetCart} from "@/hooks/cart/useGetCart";
import LottieButton from "@/components/layout/header/action-buttons/LottieButton";
import SearchButton from "@/components/layout/header/adaptive/SearchButton";

export default function ActionButtons() {
    const isSticky = useStickyStore(state => state.isSticky)
    const {data: cart} = useGetCart()
    const router = useRouter()
    const { favProducts } = useFavouriteProducts()
    const { favBrands } = useFavouriteBrands()
    const isEmpty = favProducts?.length === 0 && favBrands?.length === 0
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-row items-center gap-3 relative">
            {isSticky && (
                <SearchButton/>
            )}
            <div className="flex">
                <LottieButton json={accountJson} onClick={() => setOpen(!open)}/>
            </div>
            <div className="flex relative">
                {!isEmpty && (
                    <div className="absolute right-[-3] bg-red-500 rounded w-1 h-1 rounded-full"/>
                )}
                <LottieButton json={favJson} onClick={() => router.push("/favourites")}/>
            </div>
            <div className="flex relative">
                <LottieButton json={cartJson} onClick={() => router.push("/cart")}/>
                {cart && cart.items.length > 0 && (
                    <div className="absolute right-[-10px] top-[-5px] w-[16px] h-[16px] flex items-center justify-center rounded-full bg-red-700 text-white font-bold text-[12px]">{cart ? cart.items.length : ""}</div>
                )}
            </div>
            {open && (
                <div className="absolute top-[40px] right-0">
                    <AccountActionsModal onChange={() => setOpen(false)}/>
                </div>
            )}
        </div>

    )
}