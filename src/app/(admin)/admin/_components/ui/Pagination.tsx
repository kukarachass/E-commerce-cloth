import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cn from "@/app/(admin)/admin/_lib/cn";
import { count as fmtCount } from "@/app/(admin)/admin/_lib/format";

/** Окно страниц вокруг текущей: 1 … 4 5 6 … 20 */
function pageWindow(page: number, total: number): (number | "gap")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const out = new Set<number>([1, total, page]);
    for (const p of [page - 1, page + 1]) {
        if (p > 1 && p < total) out.add(p);
    }
    if (page <= 3) [2, 3, 4].forEach((p) => p < total && out.add(p));
    if (page >= total - 2)
        [total - 1, total - 2, total - 3].forEach((p) => p > 1 && out.add(p));

    const sorted = [...out].sort((a, b) => a - b);
    const withGaps: (number | "gap")[] = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - (sorted[i - 1] as number) > 1) withGaps.push("gap");
        withGaps.push(p);
    });
    return withGaps;
}

export default function Pagination({
    page,
    totalPages,
    total,
    perPage,
    buildHref,
    className,
}: {
    page: number;
    totalPages: number;
    total?: number;
    perPage?: number;
    buildHref: (page: number) => string;
    className?: string;
}) {
    if (totalPages <= 1) {
        if (!total || !perPage) return null;
        return (
            <p className={cn("pt-4 text-xs text-ink-faint", className)}>
                {fmtCount(total)} {total === 1 ? "record" : "records"}
            </p>
        );
    }

    const from = perPage ? (page - 1) * perPage + 1 : null;
    const to =
        perPage && total ? Math.min(page * perPage, total) : perPage ? page * perPage : null;

    const arrow =
        "grid h-9 w-9 place-items-center rounded-full border border-line-strong bg-card text-ink transition-colors hover:border-ink/25";

    return (
        <nav
            className={cn(
                "mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4",
                className,
            )}
        >
            <p className="tnum text-xs text-ink-faint">
                {from !== null && to !== null && total !== undefined
                    ? `Showing ${from}–${to} of ${fmtCount(total)}`
                    : total !== undefined
                      ? `${fmtCount(total)} records · page ${page} of ${totalPages}`
                      : `Page ${page} of ${totalPages}`}
            </p>

            <div className="flex items-center gap-1.5">
                {page > 1 ? (
                    <Link
                        href={buildHref(page - 1)}
                        aria-label="Previous page"
                        className={arrow}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <span className={cn(arrow, "opacity-35")}>
                        <ChevronLeft className="h-4 w-4" />
                    </span>
                )}

                <div className="hidden items-center gap-1 sm:flex">
                    {pageWindow(page, totalPages).map((p, i) =>
                        p === "gap" ? (
                            <span
                                key={`gap-${i}`}
                                className="px-1 text-xs text-ink-faint"
                            >
                                …
                            </span>
                        ) : (
                            <Link
                                key={p}
                                href={buildHref(p)}
                                className={cn(
                                    "tnum grid h-9 min-w-9 place-items-center rounded-full px-2 text-xs font-medium transition-colors",
                                    p === page
                                        ? "bg-ink-panel text-white"
                                        : "text-ink-soft hover:bg-sunk",
                                )}
                            >
                                {p}
                            </Link>
                        ),
                    )}
                </div>

                <span className="tnum px-2 text-xs text-ink-soft sm:hidden">
                    {page} / {totalPages}
                </span>

                {page < totalPages ? (
                    <Link
                        href={buildHref(page + 1)}
                        aria-label="Next page"
                        className={arrow}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span className={cn(arrow, "opacity-35")}>
                        <ChevronRight className="h-4 w-4" />
                    </span>
                )}
            </div>
        </nav>
    );
}
