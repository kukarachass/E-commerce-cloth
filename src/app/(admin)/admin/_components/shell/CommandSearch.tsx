"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    CornerDownLeft,
    type LucideIcon,
    Receipt,
    Search,
    ScrollText,
    PackageSearch,
    Users,
} from "lucide-react";
import cn from "@/app/(admin)/admin/_lib/cn";
import { NAV_GROUPS } from "./nav";

type Result = {
    id: string;
    label: string;
    hint: string;
    href: string;
    icon: LucideIcon;
};

/** Куда можно провалиться с произвольным запросом */
const LOOKUPS: { icon: LucideIcon; label: string; hint: string; to: (q: string) => string }[] =
    [
        {
            icon: PackageSearch,
            label: "Products",
            hint: "by name",
            to: (q) => `/admin/products?search=${encodeURIComponent(q)}`,
        },
        {
            icon: Receipt,
            label: "Orders",
            hint: "by customer email",
            to: (q) => `/admin/orders?search=${encodeURIComponent(q)}`,
        },
        {
            icon: Users,
            label: "Customers",
            hint: "by name or email",
            to: (q) => `/admin/users?search=${encodeURIComponent(q)}`,
        },
        {
            icon: ScrollText,
            label: "Activity log",
            hint: "by actor or entity id",
            to: (q) => `/admin/audit?search=${encodeURIComponent(q)}`,
        },
    ];

const PAGES: Result[] = NAV_GROUPS.flatMap((group) =>
    group.items.flatMap((item) => [
        {
            id: item.href,
            label: item.label,
            hint: group.label,
            href: item.href,
            icon: item.icon,
        },
        ...(item.children ?? []).map((child) => ({
            id: child.href,
            label: child.label,
            hint: item.label,
            href: child.href,
            icon: item.icon,
        })),
    ]),
);

/**
 * Поиск по админке. Никаких запросов на сервер: сначала прыжок по страницам,
 * затем — передача запроса в фильтр нужного списка. Быстро и предсказуемо.
 */
export default function CommandSearch({ className }: { className?: string }) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [cursor, setCursor] = useState(0);
    const boxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const results = useMemo<Result[]>(() => {
        const q = query.trim().toLowerCase();

        const pages = q
            ? PAGES.filter((p) => p.label.toLowerCase().includes(q)).slice(0, 4)
            : PAGES.slice(0, 5);

        if (!q) return pages;

        return [
            ...pages,
            ...LOOKUPS.map((l) => ({
                id: `lookup-${l.label}`,
                label: `${l.label}: “${query.trim()}”`,
                hint: l.hint,
                href: l.to(query.trim()),
                icon: l.icon,
            })),
        ];
    }, [query]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
                setOpen(true);
            }
            if (e.key === "Escape") setOpen(false);
        };
        const onClick = (e: MouseEvent) => {
            if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
        };

        window.addEventListener("keydown", onKey);
        window.addEventListener("mousedown", onClick);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("mousedown", onClick);
        };
    }, []);

    const go = (result?: Result) => {
        const target = result ?? results[cursor];
        if (!target) return;
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
        router.push(target.href);
    };

    return (
        <div ref={boxRef} className={cn("relative", className)}>
            <div
                className={cn(
                    "flex h-11 items-center gap-2.5 rounded-full bg-card pr-2 pl-4 transition-shadow",
                    open ? "shadow-float" : "shadow-card",
                )}
            >
                <Search className="h-4 w-4 shrink-0 text-ink-faint" />
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setCursor(0);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setCursor((c) => Math.min(c + 1, results.length - 1));
                        }
                        if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setCursor((c) => Math.max(c - 1, 0));
                        }
                        if (e.key === "Enter") {
                            e.preventDefault();
                            go();
                        }
                    }}
                    placeholder="Search pages, orders, customers…"
                    className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                />
                <kbd className="hidden shrink-0 rounded-md bg-sunk px-1.5 py-1 text-[10px] font-medium text-ink-faint sm:block">
                    ⌘K
                </kbd>
            </div>

            {open && results.length > 0 && (
                <div className="animate-fade absolute top-[calc(100%+8px)] right-0 left-0 z-50 overflow-hidden rounded-card bg-card p-1.5 shadow-pop">
                    {!query && (
                        <p className="px-3 py-2 text-[10px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
                            Jump to
                        </p>
                    )}

                    <ul>
                        {results.map((r, i) => {
                            const Icon = r.icon;
                            return (
                                <li key={r.id}>
                                    <button
                                        type="button"
                                        onMouseEnter={() => setCursor(i)}
                                        onClick={() => go(r)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                                            i === cursor ? "bg-sunk" : "hover:bg-sunk/60",
                                        )}
                                    >
                                        <Icon
                                            className="h-4 w-4 shrink-0 text-ink-faint"
                                            strokeWidth={1.8}
                                        />
                                        <span className="min-w-0 flex-1 truncate text-sm text-ink">
                                            {r.label}
                                        </span>
                                        <span className="shrink-0 text-xs text-ink-faint">
                                            {r.hint}
                                        </span>
                                        {i === cursor ? (
                                            <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
                                        ) : (
                                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-transparent" />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
