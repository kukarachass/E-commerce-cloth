export default function CartSkeleton() {
    return (
        <div className="max-w-[1200px] mx-auto py-10 flex flex-row gap-8 px-2 xl:px-0">
            {/* Items skeleton */}
            <div className="flex flex-col flex-1 gap-0">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-row gap-3 py-4 border-b border-[#ebebeb]">
                        <div className="w-[72px] h-[96px] shrink-0 rounded-[4px] bg-[#f0f0f0] animate-pulse" />
                        <div className="flex flex-1 flex-col justify-between py-0.5">
                            <div className="flex flex-col gap-2">
                                <div className="h-3.5 w-3/4 bg-[#f0f0f0] rounded animate-pulse" />
                                <div className="h-3 w-1/4 bg-[#f0f0f0] rounded animate-pulse" />
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="h-8 w-24 bg-[#f0f0f0] rounded animate-pulse" />
                                <div className="h-3.5 w-16 bg-[#f0f0f0] rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary skeleton */}
            <div className="w-[340px] shrink-0 flex flex-col gap-5">
                <div className="h-4 w-24 bg-[#f0f0f0] rounded animate-pulse" />
                <div className="h-10 w-full bg-[#f0f0f0] rounded animate-pulse" />
                <div className="h-[1px] bg-[#ebebeb]" />
                <div className="flex flex-col gap-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                            <div className="h-3.5 w-28 bg-[#f0f0f0] rounded animate-pulse" />
                            <div className="h-3.5 w-16 bg-[#f0f0f0] rounded animate-pulse" />
                        </div>
                    ))}
                </div>
                <div className="h-[1px] bg-[#ebebeb]" />
                <div className="flex justify-between">
                    <div className="h-4 w-16 bg-[#f0f0f0] rounded animate-pulse" />
                    <div className="h-4 w-20 bg-[#f0f0f0] rounded animate-pulse" />
                </div>
                <div className="h-10 w-full bg-[#f0f0f0] rounded animate-pulse" />
            </div>
        </div>
    )
}