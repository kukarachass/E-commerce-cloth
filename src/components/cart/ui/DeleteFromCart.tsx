"use client"

import {useState} from "react";
import DeleteIcon from "@/components/ui/icons/DeleteIcon";
import {useRemoveCartItem} from "@/hooks/cart/useRemoveFromCart";

interface DeleteFromCartProps {
    cartItemId: string;
}

export default function DeleteFromCart({ cartItemId }: DeleteFromCartProps ){
    const [hovered, setHovered] = useState(false)
    const { mutate } = useRemoveCartItem();

    return(
        <div
            onClick={() => mutate({ cartItemId })}
            className="hover:bg-red-500 rounded-[3px] flex p-[2px] transition-all duration-500 shrink-0"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <DeleteIcon hovered={hovered} />
        </div>
    )
}