import cn from "@/app/(admin)/admin/_lib/cn";

/**
 * Каркасы загрузки. Повторяют реальную раскладку страниц, поэтому при
 * появлении данных ничего не прыгает: те же отступы, та же сетка,
 * те же радиусы. Шиммер описан классом .skeleton в admin.css.
 */

export default function Skeleton({
    className,
    rounded = "rounded-lg",
}: {
    className?: string;
    rounded?: string;
}) {
    return <div className={cn("skeleton", rounded, className)} aria-hidden />;
}

function Line({ w = "w-full", h = "h-3" }: { w?: string; h?: string }) {
    return <Skeleton className={cn(h, w)} rounded="rounded-full" />;
}

/* ── шапка страницы ────────────────────────────────────────── */

function HeaderBlock({ withAction = true }: { withAction?: boolean }) {
    return (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="grid gap-3">
                <Skeleton className="h-8 w-52" rounded="rounded-xl" />
                <Line w="w-72" />
            </div>
            {withAction && <Skeleton className="h-10 w-36" rounded="rounded-full" />}
        </div>
    );
}

function FilterBlock() {
    return (
        <div className="mb-5 flex flex-col gap-2 rounded-[26px] bg-sunk p-1.5 sm:flex-row sm:items-center sm:rounded-full">
            <Skeleton className="h-11 flex-1 sm:h-10" rounded="rounded-full" />
            <Skeleton
                className="h-11 w-full sm:h-10 sm:w-40"
                rounded="rounded-full"
            />
        </div>
    );
}

/* ── страницы ──────────────────────────────────────────────── */

/** Список: шапка, фильтры, строки таблицы */
export function ListPageSkeleton({
    rows = 8,
    withTabs = false,
}: {
    rows?: number;
    withTabs?: boolean;
}) {
    return (
        <>
            <HeaderBlock />

            {withTabs && (
                <Skeleton className="mb-4 h-11 w-64" rounded="rounded-full" />
            )}

            <FilterBlock />

            <div className="rounded-card bg-card p-2 shadow-card sm:p-3">
                <div className="hidden gap-4 border-b border-line px-3 pb-2.5 lg:flex">
                    {["w-40", "w-24", "w-20", "w-24", "w-16"].map((w, i) => (
                        <Skeleton
                            key={i}
                            className={cn("h-2.5", w)}
                            rounded="rounded-full"
                        />
                    ))}
                </div>

                <ul className="grid grid-cols-1 gap-2 lg:gap-0">
                    {Array.from({ length: rows }).map((_, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-4 rounded-card bg-card p-4 shadow-card lg:rounded-none lg:border-b lg:border-line lg:bg-transparent lg:px-3 lg:py-3.5 lg:shadow-none lg:last:border-0"
                        >
                            <Skeleton className="h-12 w-10 shrink-0" />
                            <div className="grid min-w-0 flex-1 gap-2">
                                <Line w="w-1/2" />
                                <Line w="w-1/3" h="h-2.5" />
                            </div>
                            <Skeleton
                                className="hidden h-6 w-20 lg:block"
                                rounded="rounded-full"
                            />
                            <Skeleton
                                className="hidden h-6 w-16 lg:block"
                                rounded="rounded-full"
                            />
                            <Skeleton className="h-4 w-16 shrink-0" rounded="rounded-full" />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

/** Карточка сущности: две колонки блоков */
export function DetailPageSkeleton() {
    return (
        <>
            <Skeleton className="mb-3 h-3 w-24" rounded="rounded-full" />
            <HeaderBlock />

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <div className="grid grid-cols-1 content-start gap-3">
                    <div className="rounded-card bg-card p-5 shadow-card">
                        <Line w="w-32" />
                        <Skeleton className="mt-5 h-12 w-full" rounded="rounded-2xl" />
                        <Skeleton className="mt-4 h-9 w-40" rounded="rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 rounded-card bg-card p-5 shadow-card">
                        <Line w="w-24" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3.5">
                                <Skeleton className="h-14 w-11 shrink-0" />
                                <div className="grid min-w-0 flex-1 gap-2">
                                    <Line w="w-2/3" />
                                    <Line w="w-1/4" h="h-2.5" />
                                </div>
                                <Skeleton className="h-4 w-14" rounded="rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 content-start gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-1 gap-3 rounded-card bg-card p-5 shadow-card"
                        >
                            <Line w="w-28" />
                            <Line w="w-full" h="h-2.5" />
                            <Line w="w-3/4" h="h-2.5" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

/** Форма: секции слева, сводка справа */
export function FormPageSkeleton({ sections = 4 }: { sections?: number }) {
    return (
        <>
            <Skeleton className="mb-3 h-3 w-24" rounded="rounded-full" />
            <HeaderBlock withAction={false} />

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                <div className="grid grid-cols-1 gap-7 rounded-card bg-card p-5 shadow-card sm:p-6">
                    {Array.from({ length: sections }).map((_, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-1 gap-4 border-b border-line pb-7 last:border-0 last:pb-0 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8"
                        >
                            <div className="grid grid-cols-1 gap-2">
                                <Line w="w-24" />
                                <Line w="w-40" h="h-2.5" />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <Skeleton className="h-11 w-full" rounded="rounded-field" />
                                <Skeleton className="h-11 w-full" rounded="rounded-field" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 content-start gap-3">
                    <div className="grid grid-cols-1 gap-3 rounded-card bg-card p-5 shadow-card">
                        <Line w="w-24" />
                        <Skeleton className="h-14 w-full" rounded="rounded-field" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 rounded-card bg-card p-5 shadow-card">
                        <Line w="w-28" />
                        <Skeleton className="h-40 w-full" rounded="rounded-field" />
                        <Line w="w-1/2" />
                    </div>
                </div>
            </div>
        </>
    );
}

/** Дерево категорий: три показателя и две колонки веток */
export function TreePageSkeleton() {
    return (
        <>
            <HeaderBlock />

            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-28" rounded="rounded-card" />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, card) => (
                    <div key={card} className="rounded-card bg-card p-5 shadow-card">
                        <Line w="w-24" />
                        <div className="mt-5 grid grid-cols-1 gap-3.5">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3"
                                    style={{ paddingLeft: i % 3 === 0 ? 0 : 20 }}
                                >
                                    <Skeleton
                                        className="h-2 w-2 shrink-0"
                                        rounded="rounded-full"
                                    />
                                    <Line w={i % 3 === 0 ? "w-40" : "w-28"} />
                                    <span className="flex-1" />
                                    <Skeleton
                                        className="h-2.5 w-12 shrink-0"
                                        rounded="rounded-full"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

/** Дашборд: герой, плитки, графики, очереди */
export function DashboardSkeleton() {
    return (
        <>
            <HeaderBlock />

            <div className="grid grid-cols-1 gap-3">
                <div className="rounded-card bg-card p-5 shadow-card sm:p-6">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_auto]">
                        <div>
                            <Line w="w-40" h="h-2.5" />
                            <Skeleton
                                className="mt-4 h-12 w-64"
                                rounded="rounded-2xl"
                            />
                            <Line w="w-56" h="h-2.5" />
                            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-16"
                                        rounded="rounded-xl"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:w-[320px]">
                            <Skeleton className="h-28" rounded="rounded-card" />
                            <Skeleton className="h-28" rounded="rounded-card" />
                            <Skeleton
                                className="h-24 sm:col-span-2"
                                rounded="rounded-card"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-20" rounded="rounded-card" />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
                    <div className="rounded-card bg-card p-5 shadow-card">
                        <Line w="w-44" />
                        <Skeleton className="mt-6 h-52 w-full" rounded="rounded-2xl" />
                    </div>
                    <div className="rounded-card bg-card p-5 shadow-card">
                        <Line w="w-32" />
                        <div className="mt-6 flex items-center gap-5">
                            <Skeleton
                                className="h-[132px] w-[132px] shrink-0"
                                rounded="rounded-full"
                            />
                            <div className="grid min-w-0 flex-1 gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Line key={i} h="h-2.5" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, card) => (
                        <div
                            key={card}
                            className="rounded-card bg-card p-5 shadow-card"
                        >
                            <Line w="w-36" />
                            <div className="mt-5 grid grid-cols-1 gap-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton
                                            className="h-8 w-8 shrink-0"
                                            rounded="rounded-full"
                                        />
                                        <div className="grid min-w-0 flex-1 gap-2">
                                            <Line w="w-1/2" />
                                            <Line w="w-1/3" h="h-2.5" />
                                        </div>
                                        <Skeleton
                                            className="h-4 w-16 shrink-0"
                                            rounded="rounded-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
