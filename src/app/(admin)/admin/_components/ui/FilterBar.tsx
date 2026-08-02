"use client";

import { useRef } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import cn from "@/app/(admin)/admin/_lib/cn";

export type FilterSelect = {
    name: string;
    value: string;
    /** первая опция — «все», её value обычно "all" или "" */
    options: { value: string; label: string }[];
    icon?: React.ReactNode;
};

/**
 * Обычная GET-форма: фильтры живут в URL, страница остаётся серверной.
 * Селекты отправляют форму сами — лишний клик по «Найти» никому не нужен.
 * Параметр page намеренно не переносим: смена фильтра сбрасывает пагинацию.
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
    children?: React.ReactNode;
    className?: string;
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const submit = () => formRef.current?.requestSubmit();

    const dirty =
        Boolean(searchValue) ||
        selects.some((s) => s.value && s.value !== "all" && s.value !== "");

    return (
        <form
            ref={formRef}
            method="get"
            className={cn(
                "mb-5 flex flex-wrap items-center gap-2 rounded-full bg-sunk p-1.5",
                "sm:flex-nowrap",
                className,
            )}
        >
            {searchName && (
                <label className="relative flex min-w-0 flex-1 basis-full items-center sm:basis-auto">
                    <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-faint" />
                    <input
                        name={searchName}
                        defaultValue={searchValue ?? ""}
                        placeholder={searchPlaceholder}
                        className={cn(
                            "h-10 w-full rounded-full bg-card pr-4 pl-10 text-sm text-ink shadow-card",
                            "placeholder:text-ink-faint focus:outline-2 focus:outline-offset-2 focus:outline-accent",
                        )}
                    />
                </label>
            )}

            {selects.map((s) => (
                <label
                    key={s.name}
                    className="relative flex h-10 shrink-0 items-center"
                >
                    <SlidersHorizontal className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-ink-faint" />
                    <select
                        name={s.name}
                        defaultValue={s.value}
                        onChange={submit}
                        className={cn(
                            "h-10 cursor-pointer appearance-none rounded-full bg-card pr-8 pl-9 text-sm font-medium text-ink",
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

            {children}

            <div className="ml-auto flex shrink-0 items-center gap-1.5">
                {dirty && resetHref && (
                    <Link
                        href={resetHref}
                        className="grid grid-cols-1 h-10 w-10 place-items-center rounded-full text-ink-faint transition-colors hover:bg-card hover:text-ink"
                        aria-label="Reset filters"
                    >
                        <X className="h-4 w-4" />
                    </Link>
                )}
                <button
                    type="submit"
                    className="h-10 rounded-full bg-ink-panel px-5 text-sm font-medium text-white transition-colors hover:bg-ink"
                >
                    Apply
                </button>
            </div>
        </form>
    );
}
