"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import useGetActivePendingOrder from "@/hooks/checkout/useGetActivePendingOrder";

const TOAST_ID = "pending-order"

export default function PendingOrderNotifier() {
    const { data: order } = useGetActivePendingOrder()
    const router = useRouter()
    const pathname = usePathname()
    const shownFor = useRef<string | null>(null)

    useEffect(() => {
        // на самой странице заказов тост не нужен — там уже есть баннер
        const onOrdersPage = pathname?.startsWith("/account/my-orders")

        if (!order || onOrdersPage) {
            toast.dismiss(TOAST_ID)
            if (!order) shownFor.current = null
            return
        }

        // показываем один раз на конкретный заказ (не пере-всплываем при refetch)
        if (shownFor.current === order.id) return
        shownFor.current = order.id

        toast("You have an unfinished order", {
            id: TOAST_ID,
            description: `€${order.totalAmount} is waiting for payment.`,
            duration: Infinity,
            action: {
                label: "Review",
                onClick: () => router.push("/account/my-orders"),
            },
        })
    }, [order, pathname, router])

    return null
}