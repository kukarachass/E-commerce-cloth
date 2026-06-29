import { isBlocking, type ReturnItemStatus } from "@/lib/returns/status"

type HasReturns = { returnItems: { status: string; createdAt: string | Date }[] }

// самый свежий ЗНАЧИМЫЙ возврат позиции (cancelled отбрасываем — его не показываем)
export function getLatestReturnStatus(item: HasReturns): ReturnItemStatus | null {
    const latest = [...item.returnItems]
        .filter((ri) => isBlocking(ri.status as ReturnItemStatus))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    return (latest?.status as ReturnItemStatus) ?? null
}