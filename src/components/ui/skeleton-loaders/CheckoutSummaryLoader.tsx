export default function CheckoutSummarySkeletonLoader() {
    return (
        <div className="max-w-full lg:max-w-[400px] flex flex-col gap-8 w-full lg:sticky h-fit lg:top-[100px]">
            <div className="flex flex-col gap-6 p-5 sm:p-6 bg-[#f9f9f9] rounded-[10px]">
                <div className="h-5 w-32 sm:w-36 bg-[#e8e8e8] rounded animate-pulse" />

                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between items-center">
                        <div className="h-4 w-20 bg-[#e8e8e8] rounded animate-pulse" />
                        <div className="h-4 w-24 sm:w-28 bg-[#e8e8e8] rounded animate-pulse" />
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <div className="h-4 w-24 bg-[#e8e8e8] rounded animate-pulse" />
                        <div className="h-4 w-14 bg-[#e8e8e8] rounded animate-pulse" />
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <div className="h-4 w-20 bg-[#e8e8e8] rounded animate-pulse" />
                        <div className="h-4 w-14 bg-[#e8e8e8] rounded animate-pulse" />
                    </div>
                </div>

                <div className="h-[1px] w-full bg-[#ebebeb]" />

                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between items-center">
                        <div className="h-5 w-24 sm:w-28 bg-[#e8e8e8] rounded animate-pulse" />
                        <div className="h-5 w-20 bg-[#e8e8e8] rounded animate-pulse" />
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <div className="h-4 w-20 bg-[#e8e8e8] rounded animate-pulse" />
                        <div className="h-4 w-14 bg-[#e8e8e8] rounded animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                        <div className="h-3 w-full bg-[#e8e8e8] rounded animate-pulse" />
                        <div className="h-3 w-3/4 bg-[#e8e8e8] rounded animate-pulse" />
                    </div>
                </div>

                <div className="h-[1px] w-full bg-[#ebebeb]" />

                <div className="h-11 w-full bg-[#e8e8e8] rounded-[10px] animate-pulse" />

                <div className="flex flex-row items-center justify-center gap-1 flex-wrap">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-6 w-10 bg-[#e8e8e8] rounded animate-pulse" />
                    ))}
                </div>

                <div className="h-4 w-32 sm:w-36 bg-[#e8e8e8] rounded animate-pulse mx-auto" />
            </div>

            <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-row items-center gap-4">
                        <div className="w-4 h-4 bg-[#f0f0f0] rounded animate-pulse shrink-0" />
                        <div className="h-4 w-32 sm:w-36 bg-[#f0f0f0] rounded animate-pulse" />
                    </div>
                ))}
                <div className="h-6 w-24 bg-[#f0f0f0] rounded animate-pulse" />
            </div>
        </div>
    )
}