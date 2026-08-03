import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import cn from "@/app/(admin)/admin/_lib/cn";
import { euro, toNumber } from "@/app/(admin)/admin/_lib/format";

/**
 * Крупная сумма с приглушёнными центами — так взгляд цепляется за целую часть,
 * а копейки не воруют внимание.
 */
export function Money({
    value,
    className,
    mutedFraction = true,
}: {
    value: number | string | null | undefined;
    className?: string;
    mutedFraction?: boolean;
}) {
    const text = euro(toNumber(value));
    const dot = text.lastIndexOf(".");
    const head = dot === -1 ? text : text.slice(0, dot);
    const tail = dot === -1 ? "" : text.slice(dot);

    return (
        <span className={cn("tnum", className)}>
            {head}
            {tail && (
                <span className={mutedFraction ? "text-ink-faint" : undefined}>
                    {tail}
                </span>
            )}
        </span>
    );
}

type StatVariant = "plain" | "dark" | "accent" | "sunk";

const STAT_VARIANTS: Record<StatVariant, string> = {
    plain: "bg-card shadow-card",
    sunk: "bg-sunk",
    dark: "bg-ink-panel text-white shadow-float",
    accent: "bg-card ring-2 ring-accent shadow-card",
};

/** Карточка показателя. Одинаковая высота, что бы в неё ни положили. */
export function StatCard({
    label,
    value,
    sub,
    icon: Icon,
    variant = "plain",
    trailing,
    href,
    className,
}: {
    label: ReactNode;
    value: ReactNode;
    sub?: ReactNode;
    icon?: LucideIcon;
    variant?: StatVariant;
    trailing?: ReactNode;
    href?: string;
    className?: string;
}) {
    const dark = variant === "dark";

    return (
        <div
            className={cn(
                "flex min-h-[112px] flex-col justify-between gap-3 rounded-card p-4",
                STAT_VARIANTS[variant],
                href && "transition-transform duration-200 hover:-translate-y-0.5",
                className,
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <span
                    className={cn(
                        "text-xs font-medium",
                        dark ? "text-white/60" : "text-ink-faint",
                    )}
                >
                    {label}
                </span>
                {Icon && (
                    <Icon
                        className={cn(
                            "h-4 w-4 shrink-0",
                            dark ? "text-white/50" : "text-ink-faint",
                        )}
                        strokeWidth={1.8}
                    />
                )}
                {trailing}
            </div>

            <div>
                <div
                    className={cn(
                        "text-2xl leading-none font-semibold tracking-[-0.02em]",
                        dark ? "text-white" : "text-ink",
                    )}
                >
                    {value}
                </div>
                {sub && (
                    <div
                        className={cn(
                            "mt-2 text-xs",
                            dark ? "text-white/55" : "text-ink-soft",
                        )}
                    >
                        {sub}
                    </div>
                )}
            </div>
        </div>
    );
}

/** Компактный показатель для плотных мест: сайдбар заказа, шапка клиента */
export function MiniStat({
    label,
    value,
    tone,
}: {
    label: ReactNode;
    value: ReactNode;
    tone?: "accent" | "positive" | "critical";
}) {
    return (
        <div className="rounded-xl bg-sunk px-3 py-2.5">
            <div className="text-[10px] font-medium tracking-[0.06em] text-ink-faint uppercase">
                {label}
            </div>
            <div
                className={cn(
                    "tnum mt-1 text-sm font-semibold",
                    tone === "accent" && "text-accent",
                    tone === "positive" && "text-positive",
                    tone === "critical" && "text-critical",
                    !tone && "text-ink",
                )}
            >
                {value}
            </div>
        </div>
    );
}

/** Горизонтальный индикатор доли — доли статусов, наполненность коллекций */
export function ShareBar({
    value,
    max,
    tone = "accent",
    className,
}: {
    value: number;
    max: number;
    tone?: "accent" | "ink" | "positive" | "caution";
    className?: string;
}) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    const fill = {
        accent: "bg-accent",
        ink: "bg-ink-panel",
        positive: "bg-positive",
        caution: "bg-caution",
    }[tone];

    return (
        <span
            className={cn(
                "block h-1.5 w-full overflow-hidden rounded-full bg-sunk",
                className,
            )}
        >
            <span
                className={cn(
                    "animate-grow-x block h-full rounded-full transition-[width]",
                    fill,
                )}
                style={{ width: `${pct}%` }}
            />
        </span>
    );
}
