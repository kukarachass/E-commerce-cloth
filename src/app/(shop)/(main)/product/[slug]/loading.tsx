export default function ProductPageLoading() {
    return (
        <div className="max-w-[1200px] mx-auto pb-10">
            <div className="flex flex-col">
                {/* Breadcrumb skeleton */}
                <div className="py-4">
                    <div className="h-4 w-48 bg-[#f0f0f0] rounded animate-pulse" />
                </div>

                <div className="flex flex-row gap-8 pb-10">
                    {/* Gallery skeleton */}
                    <div className="w-[800px]">
                        <div className="w-full aspect-square bg-[#f0f0f0] rounded-xl animate-pulse" />
                    </div>

                    {/* Info skeleton */}
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="h-12 w-48 bg-[#f0f0f0] rounded animate-pulse" />
                            <div className="h-4 w-full bg-[#f0f0f0] rounded animate-pulse" />
                            <div className="h-4 w-3/4 bg-[#f0f0f0] rounded animate-pulse" />
                            <div className="h-6 w-24 bg-[#f0f0f0] rounded animate-pulse" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="h-10 w-full bg-[#f0f0f0] rounded animate-pulse" />
                            <div className="h-12 w-full bg-[#f0f0f0] rounded animate-pulse" />
                            <div className="flex gap-2">
                                <div className="h-12 w-12 bg-[#f0f0f0] rounded animate-pulse" />
                                <div className="h-12 flex-1 bg-[#f0f0f0] rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}