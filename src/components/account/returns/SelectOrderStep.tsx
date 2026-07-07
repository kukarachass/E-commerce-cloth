"use client"

import { useGetReturnableOrders } from "@/hooks/returns/useGetReturnableOrders"
import { getLatestReturnStatus } from "@/lib/returns/latestReturn"
import EmptyPage from "@/components/account/EmptyPage"
import ReturnOrderCard from "@/components/return/ReturnOrderCard";

type Props = { selectedId: string | null; onSelect: (orderId: string) => void }

export default function SelectOrderStep({ selectedId, onSelect }: Props) {
    const { data, isPending } = useGetReturnableOrders()

    if (isPending || !data) {
        return (
            <div className="flex flex-col gap-3">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-[88px] animate-pulse rounded-xl bg-neutral-100" />
                ))}
            </div>
        )
    }

    const { returnableOrders } = data;


    if (!returnableOrders || returnableOrders.length === 0) {
        return <EmptyPage pageName="orders" />
    }

    return (
        <div className="flex flex-col gap-3">
            {returnableOrders.map((order) => (
                <ReturnOrderCard key={order.id} order={order} onSelect={onSelect} selectedId={selectedId} />
            ))}
        </div>
    )
}