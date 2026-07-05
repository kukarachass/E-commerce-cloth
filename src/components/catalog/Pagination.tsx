"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback } from "react"

type Props = { currentPage: number; totalPages: number }

export default function Pagination({ currentPage, totalPages }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // строим URL с новым page, СОХРАНЯЯ все фильтры
    const goToPage = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (page <= 1) params.delete("page") // page=1 не пишем в URL — чище
        else params.set("page", String(page))
        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
        window.scrollTo({ top: 0, behavior: "smooth" }) // наверх при смене страницы
    }, [router, pathname, searchParams])

    if (totalPages <= 1) return null // одна страница — пагинация не нужна

    const pages = buildPageList(currentPage, totalPages)

    return (
        <nav className="flex items-center justify-center gap-1.5 py-8" aria-label="Pagination">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous page"
            >
                <ChevronLeft size={16} />
            </button>

            {pages.map((p, i) =>
                p === "…" ? (
                    <span key={`gap-${i}`} className="px-1.5 text-[13px] text-neutral-400">…</span>
                ) : (
                    <button
                        key={p}
                        onClick={() => goToPage(p)}
                        aria-current={p === currentPage ? "page" : undefined}
                        className={`h-9 min-w-9 rounded-lg px-3 text-[13px] font-medium transition-colors ${
                            p === currentPage
                                ? "bg-neutral-900 text-white"
                                : "border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                        }`}
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next page"
            >
                <ChevronRight size={16} />
            </button>
        </nav>
    )
}

// строим список страниц с многоточиями: 1 … 4 [5] 6 … 24
function buildPageList(current: number, total: number): (number | "…")[] {
    const delta = 1 // сколько соседей показывать вокруг текущей
    const range: (number | "…")[] = []
    const left = Math.max(2, current - delta)
    const right = Math.min(total - 1, current + delta)

    range.push(1) // первая всегда
    if (left > 2) range.push("…")
    for (let i = left; i <= right; i++) range.push(i)
    if (right < total - 1) range.push("…")
    if (total > 1) range.push(total) // последняя всегда

    return range
}