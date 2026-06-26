"use client"

import FavIcon from "@/components/ui/icons/FavIcon"
import useFavouriteProducts from "@/hooks/fav/useFavouriteProducts"
import useFavouriteBrands from "@/hooks/fav/useFavouriteBrands"
import { useFavAuthModal } from "@/store/useFavAuthModal"
import { authClient } from "@/lib/auth-client"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    id: string
    type: "product" | "brand"
}

function ProductFav({ id }: { id: string }) {
    const { isFavourite, toggleFav } = useFavouriteProducts()
    const { open } = useFavAuthModal()
    const { data: session } = authClient.useSession()

    const handleClick = () => {
        if (!session?.user) return open()
        toggleFav(id)
    }

    return <FavIcon isFav={isFavourite(id)} onChange={handleClick} />
}

function BrandFav({ id }: { id: string }) {
    const { isFavourite, toggleFav } = useFavouriteBrands()
    const { open } = useFavAuthModal()
    const { data: session } = authClient.useSession()

    const handleClick = () => {
        if (!session?.user) return open()
        toggleFav(id)
    }

    return <FavIcon isFav={isFavourite(id)} onChange={handleClick} />
}

export default function AddToFavButton({ id, type, className, ...rest }: Props) {
    return (
        <div
            {...rest}
            className={`${className} flex items-center justify-center`}
            onClick={(e) => e.stopPropagation()}
        >
            {type === "product" ? <ProductFav id={id} /> : <BrandFav id={id} />}
        </div>
    )
}