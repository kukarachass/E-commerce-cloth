"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import EmptyPage from "@/components/account/EmptyPage"
import OrdersSkeletonLoader from "@/components/ui/skeleton-loaders/OrdersSkeletonLoader"
import { useGetOrders } from "@/hooks/order/useGetOrders"
import PendingOrderBanner from "@/components/order/PendingOrderBanner"
import useGetActivePendingOrder from "@/hooks/checkout/useGetActivePendingOrder"
import OrderCard from "@/components/order/OrderCard"
import OrderDetailDrawer from "@/components/order/OrderDetailDrawer"
import { IOrderWithDetails } from "@/types/user"

export default function MyOrdersPage() {
    const { data: orders, isPending, isError } = useGetOrders()
    const { data: activeOrder } = useGetActivePendingOrder()

    const [selectedOrder, setSelectedOrder] = useState<IOrderWithDetails | null>(null)

    useEffect(() => {
        if (isError) toast.error("Couldn't load your orders. Please try again.")
    }, [isError])

    const list       = Array.isArray(orders) ? (orders as IOrderWithDetails[]) : []
    const pastOrders = list.filter((o) => o.id !== activeOrder?.id)
    const isEmpty    = !activeOrder && pastOrders.length === 0

    return (
        <>
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-[20px] font-semibold text-neutral-900 tracking-tight">Orders</h1>
                    <p className="text-[13px] text-neutral-400 mt-0.5">
                        Track, manage and review your purchases.
                    </p>
                </div>

                <PendingOrderBanner />

                {isPending ? (
                    <OrdersSkeletonLoader />
                ) : isError ? (
                    <div className="rounded-xl border border-neutral-200 bg-white px-5 py-8 text-center text-[13px] text-neutral-400">
                        Couldn't load your orders.{" "}
                        <button
                            onClick={() => window.location.reload()}
                            className="underline underline-offset-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                            Refresh the page
                        </button>
                    </div>
                ) : isEmpty ? (
                    <EmptyPage pageName="orders" />
                ) : (
                    <div className="flex flex-col gap-2">
                        {pastOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onClick={setSelectedOrder}
                            />
                        ))}
                    </div>
                )}
            </div>

            <OrderDetailDrawer
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </>
    )
}