"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import EmptyPage from "@/components/account/EmptyPage"
import OrdersSkeletonLoader from "@/components/ui/skeleton-loaders/OrdersSkeletonLoader"
import { useGetOrders } from "@/hooks/order/useGetOrders"
import PendingOrderBanner from "@/components/order/PendingOrderBanner";
import useGetActivePendingOrder from "@/hooks/checkout/useGetActivePendingOrder";
import OrderCard from "@/components/order/OrderCard";

export default function MyOrdersPage() {
    const { data: orders, isPending, isError } = useGetOrders()
    const { data: activeOrder } = useGetActivePendingOrder()

    useEffect(() => {
        if (isError) toast.error("Couldn't load your orders. Please try again.")
    }, [isError])

    // активный pending уже показан баннером — убираем его из ленты
    const list = Array.isArray(orders) ? orders : []
    const pastOrders = list.filter((o) => o.id !== activeOrder?.id)
    const isEmpty = !activeOrder && pastOrders.length === 0

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-[24px] font-bold text-[var(--text)]">My Orders</h1>
                <p className="text-[14px] text-[#8a8a8a]">Track, complete or cancel your orders.</p>
            </div>

            <PendingOrderBanner />

            {isPending ? (
                <OrdersSkeletonLoader />
            ) : isError ? (
                <div className="rounded-2xl border border-[#ececec] bg-white p-8 text-center text-[14px] text-[#8a8a8a]">
                    Couldn’t load your orders. Please refresh the page.
                </div>
            ) : isEmpty ? (
                <EmptyPage pageName="orders" />
            ) : (
                <div className="flex flex-col gap-3">
                    {pastOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    )
}