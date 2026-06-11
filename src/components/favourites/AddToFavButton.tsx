"use client"

import FavIcon from "@/components/ui/icons/FavIcon"
import useFavouriteProducts from "@/hooks/fav/useFavouriteProducts";
import useFavouriteBrands from "@/hooks/fav/useFavouriteBrands";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    id: string
    type: "product" | "brand"
}

function ProductFav({ id }: { id: string }) {
    console.log("функция product fav вызвана, product id ----->", id)

    const { isFavourite, toggleFav } = useFavouriteProducts()
    return <FavIcon isFav={isFavourite(id)} onChange={() => toggleFav(id)} />
}

function BrandFav({ id }: { id: string }) {
    console.log("функция brand fav вызвана, brand id ----->", id)
    const { isFavourite, toggleFav } = useFavouriteBrands()
    return <FavIcon isFav={isFavourite(id)} onChange={() => toggleFav(id)} />
}

export default function AddToFavButton({ id, type, className, ...rest }: Props) {
    console.log("add to fav button")
    return (
        <div {...rest} className={`${className} flex items-center justify-center`}>
            {type === "product" ? <ProductFav id={id} /> : <BrandFav id={id} />}
        </div>
    )
}