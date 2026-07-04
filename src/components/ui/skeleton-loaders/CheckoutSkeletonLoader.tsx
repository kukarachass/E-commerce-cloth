export default function CheckoutSkeletonLoader() {
    return (
        <div className="max-w-[1200px] mx-auto py-6 sm:py-10 px-4">
            {/* Steps */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6 sm:mb-10">
                {["Information", "Payment", "Confirmation"].map((_, i) => (
                    <div key={i} className="h-4 w-16 sm:w-24 bg-[#f0f0f0] rounded animate-pulse" />
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left — content */}
                <div className="flex-1 flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <div className="h-6 w-32 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-24 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-40 bg-[#f0f0f0] rounded animate-pulse" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="h-6 w-48 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-32 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-36 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-28 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-20 bg-[#f0f0f0] rounded animate-pulse mt-1" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="h-6 w-36 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-[80px] w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    </div>
                </div>

                {/* Right — order summary */}
                <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-4">
                    <div className="h-6 w-36 bg-[#f0f0f0] rounded animate-pulse" />

                    <div className="flex justify-between">
                        <div className="h-4 w-28 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-16 bg-[#f0f0f0] rounded animate-pulse" />
                    </div>

                    <div className="flex justify-between">
                        <div className="h-4 w-24 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-14 bg-[#f0f0f0] rounded animate-pulse" />
                    </div>

                    <div className="h-[1px] bg-[#ebebeb]" />

                    <div className="flex justify-between">
                        <div className="h-5 w-28 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-5 w-20 bg-[#f0f0f0] rounded animate-pulse" />
                    </div>

                    <div className="flex justify-between">
                        <div className="h-4 w-24 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-12 bg-[#f0f0f0] rounded animate-pulse" />
                    </div>

                    <div className="h-4 w-full bg-[#f0f0f0] rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-[#f0f0f0] rounded animate-pulse" />

                    <div className="h-10 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />

                    <div className="flex justify-center gap-2 flex-wrap">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-6 w-10 bg-[#f0f0f0] rounded animate-pulse" />
                        ))}
                    </div>

                    <div className="h-4 w-36 bg-[#f0f0f0] rounded animate-pulse mx-auto" />

                    <div className="h-[1px] bg-[#ebebeb]" />

                    <div className="flex flex-col gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#f0f0f0] rounded-full animate-pulse shrink-0" />
                                <div className="h-4 w-40 bg-[#f0f0f0] rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}