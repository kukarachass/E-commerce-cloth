"use client"

import FavouritesSwitcher from "@/components/favourites/FavouritesSwitcher";
import { useState } from "react";
import Container from "@/components/layout/Сontainer";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import {useRouter} from "next/navigation";
import useFavouriteProducts from "@/hooks/fav/useFavouriteProducts";
import useFavouriteBrands from "@/hooks/fav/useFavouriteBrands";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import BrandCard from "@/components/ui/cards/BrandCard";
import {useGender} from "@/hooks/useGender";

export default function FavouritesPage(){
    const { favProducts } = useFavouriteProducts()
    const { favBrands } = useFavouriteBrands()

    const isEmpty = (favProducts?.length ?? 0) === 0 && (favBrands?.length ?? 0) === 0
    const firstSelected = (): "products" | "brands" => {
        if (!favProducts?.length && !favBrands?.length) return "products"
        if (!favProducts?.length) return "brands"
        if (!favBrands?.length) return "products"
        return favProducts.length >= favBrands.length ? "products" : "brands"
    }

    const [selected, setSelected] = useState<"brands" | "products">(firstSelected);
    const router = useRouter()
    const gender = useGender();
    return(
        <Container className="flex flex-col min-h-[80vh] pb-10">
                {!isEmpty ? (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4 items-center pt-10">
                            <h1 className="text-[var(--text)] font-bold text-[32px]">Favourites</h1>
                            <FavouritesSwitcher current={selected} onChange={setSelected}/>
                        </div>
                        <div>
                            {selected === "products" ? (
                                <div className="grid grid-cols-4 gap-4">
                                    {favProducts?.map((item) => (
                                        <CatalogProductCard key={item.productId} product={item.product}/>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-4">
                                    {favBrands?.map((item) => (
                                        <BrandCard variant={"wide"} key={item.id} brand={item}/>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ): (
                    <div className="flex flex-col gap-4 py-[148px] items-center max-w-[350px] mx-auto">
                        <h1 className="text-[var(--text)] text-[32px] font-bold">Favourites</h1>
                        <p className="text-[var(--text)] text-[16px] text-center">
                            Your favourites looks pretty empty... Never miss out! Follow{" "}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle mb-0.5">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            {" "}favourites brands and items
                        </p>
                        <ButtonPrimary onClick={() => router.push(`/${gender}/brands`)} className="max-w-[200px] text-[16px]" variant={"primary"}>
                            Back to all brands
                        </ButtonPrimary>
                    </div>
                )}
        </Container>

    )
}