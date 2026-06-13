export default function OrdersSkeletonLoader() {
    return (
        <div className="flex flex-col gap-6">
            <div className="h-7 w-32 bg-[#f0f0f0] rounded animate-pulse" />
            <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-row items-center justify-between p-5 border border-[#ebebeb] rounded-[12px]">
                        <div className="flex flex-col gap-2">
                            <div className="h-3 w-28 bg-[#f0f0f0] rounded animate-pulse" />
                            <div className="h-4 w-40 bg-[#f0f0f0] rounded animate-pulse" />
                            <div className="h-3 w-36 bg-[#f0f0f0] rounded animate-pulse" />
                        </div>
                        <div className="flex flex-row items-center gap-6">
                            <div className="flex flex-col items-end gap-2">
                                <div className="h-4 w-16 bg-[#f0f0f0] rounded animate-pulse" />
                                <div className="h-4 w-12 bg-[#f0f0f0] rounded-full animate-pulse" />
                            </div>
                            <div className="w-4 h-4 bg-[#f0f0f0] rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}