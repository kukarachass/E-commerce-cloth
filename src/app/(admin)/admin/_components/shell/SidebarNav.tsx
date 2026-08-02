"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ExternalLink, Plus } from "lucide-react";
import cn from "@/app/(admin)/admin/_lib/cn";
import type { NavCounts } from "@/lib/admin/queries/admin-queries/getNavCounts";
import { NAV_GROUPS, groupOf, isItemActive, type NavItem } from "./nav";

/**
 * Полное дерево разделов. Группа с текущей страницей раскрыта всегда,
 * остальные админ волен открывать сам — состояние живёт только в сессии
 * вкладки, чтобы не тащить ещё один источник правды.
 */
export default function SidebarNav({
    counts,
    onNavigate,
}: {
    counts: NavCounts;
    onNavigate?: () => void;
}) {
    const pathname = usePathname();
    const activeGroup = groupOf(pathname);
    const [open, setOpen] = useState<Record<string, boolean>>({});

    // при переходе в другой раздел раскрываем его и не трогаем ручные открытия
    useEffect(() => {
        setOpen((prev) => ({ ...prev, [activeGroup.id]: true }));
    }, [activeGroup.id]);

    return (
        <nav className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pb-4 scrollbar-slim">
            {NAV_GROUPS.map((group) => {
                const expanded = open[group.id] ?? group.id === activeGroup.id;

                return (
                    <div key={group.id}>
                        <button
                            type="button"
                            onClick={() =>
                                setOpen((prev) => ({ ...prev, [group.id]: !expanded }))
                            }
                            className="group/head flex w-full items-center gap-2 px-3 pb-1.5 text-[10px] font-semibold tracking-[0.14em] text-ink-faint uppercase transition-colors hover:text-ink-soft"
                        >
                            <span>{group.label}</span>
                            <span className="h-px flex-1 bg-line-strong" />
                            <ChevronDown
                                className={cn(
                                    "h-3 w-3 transition-transform duration-200",
                                    !expanded && "-rotate-90",
                                )}
                            />
                        </button>

                        {expanded && (
                            <ul className="grid gap-0.5">
                                {group.items.map((item) => (
                                    <NavRow
                                        key={item.href}
                                        item={item}
                                        pathname={pathname}
                                        counts={counts}
                                        onNavigate={onNavigate}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}

            <Link
                href="/women"
                onClick={onNavigate}
                className="mt-auto flex items-center gap-2.5 rounded-full px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-card hover:text-ink"
            >
                <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
                Back to store
            </Link>
        </nav>
    );
}

function NavRow({
    item,
    pathname,
    counts,
    onNavigate,
}: {
    item: NavItem;
    pathname: string;
    counts: NavCounts;
    onNavigate?: () => void;
}) {
    const active = isItemActive(pathname, item);
    const badgeValue = item.badge ? counts[item.badge] : 0;
    const Icon = item.icon;

    return (
        <li>
            <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                    "flex h-10 items-center gap-2.5 rounded-full px-3 text-sm transition-all duration-200",
                    active
                        ? "bg-card font-semibold text-accent shadow-card"
                        : "text-ink-soft hover:bg-card/70 hover:text-ink",
                )}
            >
                <Icon
                    className={cn("h-4 w-4 shrink-0", active && "text-accent")}
                    strokeWidth={active ? 2.2 : 1.8}
                />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>

                {badgeValue > 0 && (
                    <span
                        className={cn(
                            "tnum inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                            item.badgeTone === "caution"
                                ? "bg-caution-soft text-caution"
                                : "bg-accent text-white",
                        )}
                    >
                        {badgeValue > 99 ? "99+" : badgeValue}
                    </span>
                )}
            </Link>

            {/* подпункты появляются, только когда раздел открыт — экономим высоту */}
            {active && item.children && (
                <ul className="mt-0.5 ml-6 border-l border-line-strong pl-3">
                    {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                            <li key={child.href} className="relative">
                                <span className="absolute top-1/2 -left-3 h-px w-2.5 bg-line-strong" />
                                <Link
                                    href={child.href}
                                    onClick={onNavigate}
                                    className={cn(
                                        "flex h-8 items-center gap-2 rounded-full px-2.5 text-[13px] transition-colors",
                                        childActive
                                            ? "font-medium text-accent"
                                            : "text-ink-faint hover:text-ink",
                                    )}
                                >
                                    <Plus className="h-3 w-3" strokeWidth={2} />
                                    {child.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </li>
    );
}
