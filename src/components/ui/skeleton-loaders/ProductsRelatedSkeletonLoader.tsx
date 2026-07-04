export default function ProductsRelatedSkeleton() {
    return (
        <div className="flex flex-col w-full min-w-0 max-w-[1200px]">
            <div className="flex flex-col gap-3 w-full min-w-0">
                {/* Title */}
                <div className="h-[24px] sm:h-[28px] w-[220px] bg-neutral-200 rounded-[4px] animate-pulse" />

                {/* Cards row — matches Slider layout: overflow-x-auto, gap-4, shrink-0 170px cards */}
                <div className="flex gap-4 overflow-x-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-3 w-[170px] shrink-0">
                            {/* Image */}
                            <div className="w-[170px] h-[270px] rounded-[8px] bg-neutral-200 animate-pulse" />

                            {/* Text lines */}
                            <div className="flex flex-col gap-[5px]">
                                <div className="h-[14px] w-full bg-neutral-200 rounded-[3px] animate-pulse" />
                                <div className="h-[14px] w-[70%] bg-neutral-200 rounded-[3px] animate-pulse" />
                                <div className="h-[14px] w-[50%] bg-neutral-200 rounded-[3px] animate-pulse mt-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}