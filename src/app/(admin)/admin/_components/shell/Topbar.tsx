"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Menu, Plus } from "lucide-react";
import cn from "@/app/(admin)/admin/_lib/cn";
import Avatar from "@/app/(admin)/admin/_components/ui/Avatar";
import type { NavCounts } from "@/lib/admin/queries/admin-queries/getNavCounts";
import CommandSearch from "./CommandSearch";
import { QUICK_ACTIONS } from "./nav";

export type AdminUser = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
};

export default function Topbar({
    user,
    counts,
    onOpenMenu,
}: {
    user: AdminUser;
    counts: NavCounts;
    onOpenMenu: () => void;
}) {
    const alerts = counts.toFulfill + counts.openReturns;

    return (
        <header className="flex h-14 shrink-0 items-center gap-2 sm:gap-3">
            {/* бренд — по ширине сайдбара, чтобы колонки совпадали */}
            <div className="flex h-11 w-[224px] shrink-0 items-center gap-2.5 pl-1 max-lg:w-auto">
                <button
                    type="button"
                    onClick={onOpenMenu}
                    aria-label="Open navigation"
                    className="grid grid-cols-1 h-11 w-11 place-items-center rounded-full bg-card text-ink shadow-card lg:hidden"
                >
                    <Menu className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </button>

                <Link href="/admin" className="min-w-0 max-lg:hidden">
                    <span className="block truncate text-[15px] leading-tight font-semibold tracking-[-0.01em] text-ink">
                        Extropy
                    </span>
                    <span className="block text-[11px] leading-tight text-ink-faint">
                        Admin console
                    </span>
                </Link>
            </div>

            <CommandSearch className="min-w-0 flex-1 lg:max-w-[420px]" />

            <div className="ml-auto flex shrink-0 items-center gap-2">
                <QuickCreate />

                <Link
                    href="/admin/orders?fulfillment=unfulfilled&payment=paid"
                    aria-label={`Attention needed: ${alerts}`}
                    className="relative hidden h-11 w-11 place-items-center rounded-full bg-card text-ink-soft shadow-card transition-colors hover:text-ink sm:grid"
                >
                    <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    {alerts > 0 && (
                        <span className="tnum absolute -top-0.5 -right-0.5 grid grid-cols-1 h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white ring-2 ring-canvas">
                            {alerts > 9 ? "9+" : alerts}
                        </span>
                    )}
                </Link>

                <div className="flex h-11 items-center gap-2.5 rounded-full bg-card pr-3.5 pl-1.5 shadow-card">
                    <Avatar
                        name={user.name}
                        email={user.email}
                        src={user.image}
                        size="sm"
                    />
                    <div className="hidden min-w-0 leading-tight sm:block">
                        <div className="max-w-[140px] truncate text-xs font-semibold text-ink">
                            {user.name ?? "Administrator"}
                        </div>
                        <div className="max-w-[140px] truncate text-[10px] text-ink-faint">
                            {user.email}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function QuickCreate() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        window.addEventListener("mousedown", onClick);
        return () => window.removeEventListener("mousedown", onClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Create"
                aria-expanded={open}
                className={cn(
                    "grid h-11 w-11 place-items-center rounded-full bg-accent text-white shadow-float transition-transform duration-200",
                    open && "rotate-45",
                )}
            >
                <Plus className="h-5 w-5" strokeWidth={2.2} />
            </button>

            {open && (
                <div className="animate-fade absolute top-[calc(100%+8px)] right-0 z-50 w-52 overflow-hidden rounded-card bg-card p-1.5 shadow-pop">
                    <p className="px-3 py-2 text-[10px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
                        Create new
                    </p>
                    {QUICK_ACTIONS.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-sunk"
                        >
                            {action.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
