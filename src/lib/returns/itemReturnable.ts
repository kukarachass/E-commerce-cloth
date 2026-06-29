import {isBlocking, ReturnItemStatus} from "@/lib/returns/status"
import {BlockedReason, ItemReturnState, ReturnableItem} from "@/types/returns";

export function getItemReturnState(item: ReturnableItem): ItemReturnState {
    const purchased = item.quantity


    // суммируем только блокирующие статусы; cancelled освобождает единицы
    const locked = item.returnItems.reduce((sum, ri) => {
        return isBlocking(ri.status as ReturnItemStatus) ? sum + ri.quantity : sum
    }, 0)

    const returnable = Math.max(0, purchased - locked)

    // если возвращать нечего — определяем ПОЧЕМУ (по самому свежему блокирующему возврату)
    let blockedReason: BlockedReason = null
    if (returnable === 0) {
        const lastBlocking = [...item.returnItems]
            .filter((ri) => isBlocking(ri.status as ReturnItemStatus))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

        if (lastBlocking) {
            if (lastBlocking.status === "rejected") blockedReason = "rejected"
            else if (lastBlocking.status === "refunded") blockedReason = "refunded"
            else blockedReason = "in_progress" // requested / approved
        }
    }

    return { purchased, locked, returnable, isReturnable: returnable > 0, blockedReason }
}