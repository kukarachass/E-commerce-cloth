import type { ReactNode } from "react";
import cn from "@/app/(admin)/admin/_lib/cn";

export type Tone =
    | "neutral"
    | "dark"
    | "accent"
    | "positive"
    | "caution"
    | "critical"
    | "info";

const TONE_SOFT: Record<Tone, string> = {
    neutral: "bg-sunk text-ink-soft",
    dark: "bg-ink-panel text-white",
    accent: "bg-accent-soft text-accent-deep",
    positive: "bg-positive-soft text-positive",
    caution: "bg-caution-soft text-caution",
    critical: "bg-critical-soft text-critical",
    info: "bg-info-soft text-info",
};

const TONE_DOT: Record<Tone, string> = {
    neutral: "bg-ink-faint",
    dark: "bg-ink",
    accent: "bg-accent",
    positive: "bg-positive",
    caution: "bg-caution",
    critical: "bg-critical",
    info: "bg-info",
};

interface BadgeProps {
    tone?: Tone;
    children: ReactNode;
    /** маленькая точка слева — читается быстрее, чем цвет фона */
    dot?: boolean;
    className?: string;
}

export default function Badge({
    tone = "neutral",
    dot,
    children,
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs leading-none font-medium",
                TONE_SOFT[tone],
                className,
            )}
        >
            {dot && (
                <span className={cn("h-1.5 w-1.5 rounded-full", TONE_DOT[tone])} />
            )}
            {children}
        </span>
    );
}

/** Чёрный кружок с числом — как счётчики в референсе */
export function CountChip({
    value,
    tone = "dark",
    className,
}: {
    value: ReactNode;
    tone?: Tone;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "tnum inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-semibold",
                TONE_SOFT[tone],
                className,
            )}
        >
            {value}
        </span>
    );
}

/** Дельта со стрелкой: ▲ 7.9% */
export function TrendPill({
    value,
    className,
    invert,
}: {
    /** проценты; null — сравнивать не с чем */
    value: number | null | undefined;
    className?: string;
    /** для метрик, где рост — это плохо (например, возвраты) */
    invert?: boolean;
}) {
    if (value === null || value === undefined) {
        return (
            <span
                className={cn(
                    "inline-flex items-center rounded-full bg-sunk px-2.5 py-1 text-xs font-medium text-ink-faint",
                    className,
                )}
            >
                no data
            </span>
        );
    }

    const good = invert ? value < 0 : value > 0;
    const flat = value === 0;

    return (
        <span
            className={cn(
                "tnum inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                flat
                    ? "bg-sunk text-ink-soft"
                    : good
                      ? "bg-positive-soft text-positive"
                      : "bg-accent text-white",
                className,
            )}
        >
            {!flat && (
                <svg
                    viewBox="0 0 12 12"
                    className={cn("h-3 w-3", value < 0 && "rotate-180")}
                    aria-hidden
                >
                    <path
                        d="M6 2.5 10 8H2z"
                        fill="currentColor"
                    />
                </svg>
            )}
            {Math.abs(value)}%
        </span>
    );
}
