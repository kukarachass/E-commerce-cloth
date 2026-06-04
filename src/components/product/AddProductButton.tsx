"use client"

import { useAddToCart } from "@/hooks/cart/useAddToCart"
import { toast } from "sonner"
import { ProductWithDetails } from "@/types/product-details"
import AddToBagButton from "@/components/product/AddToBagButton"
import { productSize } from "@/db/schema"

type ProductSize = typeof productSize.$inferSelect

interface AddProductButtonProps {
    product: ProductWithDetails
    selectedSize: ProductSize | null // ← получаем сверху
    disabled?: boolean
}

export default function AddProductButton({ product, selectedSize, disabled }: AddProductButtonProps) {
    const { mutate: addToCart, isPending } = useAddToCart()

    const handleAddToBag = () => {
        if (!selectedSize) {
            toast.error("Please select a size")
            return
        }

        addToCart(
            {
                productId: product.id,
                productSizeId: selectedSize.id,
                quantity: 1,
            },
            {
                onError: (error) => toast.error(error.message),
            }
        )
    }

    return (
        <AddToBagButton disabled={disabled} className="w-full" onAddToBag={handleAddToBag}>
            {isPending ? "Adding..." : "Add to cart"}
        </AddToBagButton>
    )
}