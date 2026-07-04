export default function OrdersSkeletonLoader() {
    return (
        <div className="flex flex-col gap-6">
            <div className="h-7 w-32 bg-[#f0f0f0] rounded animate-pulse" />
            <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 border border-[#ebebeb] rounded-[12px]">
                        <div className="flex flex-col gap-2 min-w-0 flex-1">
                            <div className="h-3 w-24 sm:w-28 bg-[#f0f0f0] rounded animate-pulse" />
                            <div className="h-4 w-32 sm:w-40 bg-[#f0f0f0] rounded animate-pulse" />
                            <div className="h-3 w-28 sm:w-36 bg-[#f0f0f0] rounded animate-pulse" />
                        </div>
                        <div className="flex flex-row items-center gap-3 sm:gap-6 shrink-0">
                            <div className="flex flex-col items-end gap-2">
                                <div className="h-4 w-14 sm:w-16 bg-[#f0f0f0] rounded animate-pulse" />
                                <div className="h-4 w-12 bg-[#f0f0f0] rounded-full animate-pulse" />
                            </div>
                            <div className="w-4 h-4 bg-[#f0f0f0] rounded animate-pulse shrink-0" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}