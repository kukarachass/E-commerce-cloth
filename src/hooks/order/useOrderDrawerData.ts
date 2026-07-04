import { IOrderWithReturns } from "@/types/IOrder"

type ProductSnapshot = { name?: string; brand?: string; originalPrice?: string; color?: string }
type AddressSnapshot = { street?: string; houseNumber?: string; houseAddition?: string; postcode?: string; city?: string; country?: string }

const FULFILLMENT_TO_STEP: Record<string, number> = {
    unfulfilled: 1, processing: 2, shipped: 3, delivered: 4,
}
const PAYMENT_TO_STEP: Record<string, number> = { pending: 0, paid: 1 }

export function useOrderDrawerData(order: IOrderWithReturns | null) {
    if (!order) return null

    const total       = parseFloat(order.totalAmount)
    const deliveryFee = parseFloat(order.deliveryFee)

    const originalTotal = order.items.reduce((acc, item) => {
        const snap = item.productSnapshot as ProductSnapshot
        const orig = snap?.originalPrice ? parseFloat(snap.originalPrice) : parseFloat(item.price)
        return acc + orig * item.quantity
    }, 0)

    const isPaid       = order.paymentStatus === "paid" || order.paymentStatus === "refunded"
    const currentStep  = isPaid
        ? (FULFILLMENT_TO_STEP[order.fulfillmentStatus] ?? 1)
        : (PAYMENT_TO_STEP[order.paymentStatus] ?? 0)

    const displayStatus = order.paymentStatus === "paid"
        ? order.fulfillmentStatus
        : order.paymentStatus

    const snap = order.addressSnapshot as AddressSnapshot | null
    const formattedAddress = snap
        ? [
            `${snap.street ?? ""} ${snap.houseNumber ?? ""}${snap.houseAddition ? ` ${snap.houseAddition}` : ""}`.trim(),
            `${snap.postcode ?? ""} ${snap.city ?? ""}`.trim(),
            snap.country,
        ].filter(Boolean).join(", ")
        : null

    const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
    })

    return {
        total,
        deliveryFee,
        saved: originalTotal - total,
        currentStep,
        displayStatus,
        formattedAddress,
        formattedDate,
        isCancelled: order.fulfillmentStatus === "cancelled",
        isReturned:  order.fulfillmentStatus === "returned",
    }
}