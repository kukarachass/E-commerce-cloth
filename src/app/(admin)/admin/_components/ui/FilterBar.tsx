"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import cn from "@/app/(admin)/admin/_lib/cn";

export type FilterSelect = {
    name: string;
    value: string;
    /** первая опция — «все», её value обычно "all" или "" */
    options: { value: string; label: string }[];
};

/**
 * Обычная GET-форма: фильтры живут в URL, страница остаётся серверной.
 * Селекты отправляют форму сами — лишний клик по «Apply» никому не нужен.
 * Параметр page намеренно не переносим: смена фильтра сбрасывает пагинацию.
 *
 * Раскладка: на широком экране одна строка «поиск — фильтры — Apply».
 * На узком Apply уезжает внутрь поля поиска круглой кнопкой, а фильтры
 * встают отдельной строкой — иначе кнопка отрывается от поля и висит одна.
 */
export default function FilterBar({
    searchName = "search",
    searchValue,
    searchPlaceholder = "Search",
    selects = [],
    resetHref,
    children,
    className,
}: {
    searchName?: string | null;
    searchValue?: string;
    searchPlaceholder?: string;
    selects?: FilterSelect[];
    /** показываем «сбросить», когда что-то выбрано */
    resetHref?: string;
    /** скрытые поля, которые надо пронести в query */
    children?: React.ReactNode;
    className?: string;
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const submit = () => formRef.current?.requestSubmit();

    const dirty =
        Boolean(searchValue) ||
        selects.some((s) => s.value && s.value !== "all" && s.value !== "");

    const showReset = dirty && Boolean(resetHref);
    // на узком экране вторая строка нужна, только если в ней что-то есть
    const hasControls = selects.length > 0 || showReset;

    return (
        <form
            ref={formRef}
            method="get"
            className={cn(
                "mb-5 flex flex-col gap-2 rounded-[26px] bg-sunk p-1.5",
                "sm:flex-row sm:items-center sm:rounded-full",
                className,
            )}
        >
            {children}

            {searchName && (
                <label className="relative flex min-w-0 flex-1 items-center">
                    <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-faint" />
                    <input
                        name={searchName}
                        defaultValue={searchValue ?? ""}
                        placeholder={searchPlaceholder}
                        className={cn(
                            "h-11 w-full rounded-full bg-card pr-12 pl-10 text-sm text-ink shadow-card sm:h-10 sm:pr-4",
                            "placeholder:text-ink-faint focus:outline-2 focus:outline-offset-2 focus:outline-accent",
                        )}
                    />

                    {/* мобильный сабмит живёт прямо в поле — палец уже там */}
                    <button
                        type="submit"
                        aria-label="Apply filters"
                        className="absolute right-1.5 grid h-8 w-8 place-items-center rounded-full bg-ink-panel text-white transition-transform active:scale-95 sm:hidden"
                    >
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </label>
            )}

            <div
                className={cn(
                    "flex items-center gap-2 sm:shrink-0",
                    !hasControls && "max-sm:hidden",
                )}
            >
                {selects.map((s) => (
                    <label
                        key={s.name}
                        className="relative flex h-11 min-w-0 flex-1 items-center sm:h-10 sm:flex-none"
                    >
                        {/* иконку прячем на узком экране: подписи фильтров
                            длиннее, чем половина строки, и она съедает буквы */}
                        <SlidersHorizontal className="pointer-events-none absolute left-3.5 hidden h-3.5 w-3.5 text-ink-faint sm:block" />
                        <select
                            name={s.name}
                            defaultValue={s.value}
                            onChange={submit}
                            className={cn(
                                "h-11 w-full cursor-pointer appearance-none rounded-full bg-card pr-7 pl-4 text-sm font-medium text-ink sm:h-10 sm:w-auto sm:pr-8 sm:pl-9",
                                "shadow-card focus:outline-2 focus:outline-offset-2 focus:outline-accent",
                            )}
                        >
                            {s.options.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        <svg
                            viewBox="0 0 10 6"
                            className="pointer-events-none absolute right-3 h-1.5 w-2.5 text-ink-faint"
                            aria-hidden
                        >
                            <path
                                d="M1 1l4 4 4-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </label>
                ))}

                {showReset && (
                    <Link
                        href={resetHref!}
                        aria-label="Reset filters"
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-card hover:text-ink sm:h-10 sm:w-10"
                    >
                        <X className="h-4 w-4" />
                    </Link>
                )}

                <button
                    type="submit"
                    className="hidden h-10 shrink-0 rounded-full bg-ink-panel px-5 text-sm font-medium text-white transition-colors hover:bg-ink sm:block"
                >
                    Apply
                </button>
            </div>
        </form>
    );
}
