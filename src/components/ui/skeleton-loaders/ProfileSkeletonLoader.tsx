export default function ProfileSkeletonLoader() {
    return (
        <div className="w-full flex flex-col gap-8">

            <div className="h-9 w-40 sm:w-48 bg-[#f0f0f0] rounded animate-pulse mb-2" />

            {/* Section 1: Personal information */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#ebebeb]">
                    <div className="h-6 w-36 sm:w-44 bg-[#f0f0f0] rounded animate-pulse" />
                    <div className="h-4 w-4 bg-[#f0f0f0] rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />

                    <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-3 sm:gap-4">
                        <div className="h-14 bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                        <div className="h-14 bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    </div>

                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="col-span-2 sm:col-span-1 h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                </div>

                <div className="mt-2 h-11 w-full sm:w-36 bg-[#f0f0f0] rounded-[10px] animate-pulse" />
            </div>

            {/* Section 2: Delete account */}
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex justify-between items-center pb-4 border-b border-[#ebebeb]">
                    <div className="h-6 w-28 sm:w-32 bg-[#f0f0f0] rounded animate-pulse" />
                    <div className="h-4 w-4 bg-[#f0f0f0] rounded animate-pulse" />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="h-4 w-2/3 bg-[#f0f0f0] rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-[#f0f0f0] rounded animate-pulse" />
                </div>
            </div>

        </div>
    )
}