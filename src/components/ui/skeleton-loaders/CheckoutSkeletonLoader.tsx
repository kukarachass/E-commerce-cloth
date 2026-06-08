export default function CheckoutSkeletonLoader() {
    return (
        <div className="max-w-[1200px] mx-auto py-10 px-4">
            {/* Steps */}
            <div className="flex items-center justify-center gap-8 mb-10">
                {["Information", "Payment", "Confirmation"].map((_, i) => (
                    <div key={i} className="h-4 w-24 bg-[#f0f0f0] rounded animate-pulse" />
                ))}
            </div>

            <div className="flex flex-row gap-8">
                {/* Left — content */}
                <div className="flex-1 flex flex-col gap-8">
                    {/* Contact info */}
                    <div className="flex flex-col gap-3">
                        <div className="h-6 w-32 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-24 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-40 bg-[#f0f0f0] rounded animate-pulse" />
                    </div>

                    {/* Shipping address */}
                    <div className="flex flex-col gap-3">
                        <div className="h-6 w-48 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-32 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-36 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-28 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-20 bg-[#f0f0f0] rounded animate-pulse mt-1" />
                    </div>

                    {/* Delivery option */}
                    <div className="flex flex-col gap-3">
                        <div className="h-6 w-36 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-[80px] w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    </div>
                </div>

                {/* Right — order summary */}
                <div className="w-[340px] shrink-0 flex flex-col gap-4">
                    <div className="h-6 w-36 bg-[#f0f0f0] rounded animate-pulse" />

                    {/* Items row */}
                    <div className="flex justify-between">
                        <div className="h-4 w-28 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-16 bg-[#f0f0f0] rounded animate-pulse" />
                    </div>

                    {/* Shipping row */}
                    <div className="flex justify-between">
                        <div className="h-4 w-24 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-14 bg-[#f0f0f0] rounded animate-pulse" />
                    </div>

                    <div className="h-[1px] bg-[#ebebeb]" />

                    {/* Total */}
                    <div className="flex justify-between">
                        <div className="h-5 w-28 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-5 w-20 bg-[#f0f0f0] rounded animate-pulse" />
                    </div>

                    {/* Total saved */}
                    <div className="flex justify-between">
                        <div className="h-4 w-24 bg-[#f0f0f0] rounded animate-pulse" />
                        <div className="h-4 w-12 bg-[#f0f0f0] rounded animate-pulse" />
                    </div>

                    <div className="h-4 w-full bg-[#f0f0f0] rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-[#f0f0f0] rounded animate-pulse" />

                    {/* Button */}
                    <div className="h-10 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />

                    {/* Payment icons */}
                    <div className="flex justify-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-6 w-10 bg-[#f0f0f0] rounded animate-pulse" />
                        ))}
                    </div>

                    {/* Back to cart */}
                    <div className="h-4 w-36 bg-[#f0f0f0] rounded animate-pulse mx-auto" />

                    <div className="h-[1px] bg-[#ebebeb]" />

                    {/* Advantages */}
                    <div className="flex flex-col gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#f0f0f0] rounded-full animate-pulse" />
                                <div className="h-4 w-40 bg-[#f0f0f0] rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}