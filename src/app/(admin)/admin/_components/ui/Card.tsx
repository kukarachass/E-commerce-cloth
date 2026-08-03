import type { ReactNode } from "react";
import cn from "@/app/(admin)/admin/_lib/cn";

type Variant = "plain" | "sunk" | "dark" | "aurora" | "outline";

const VARIANTS: Record<Variant, string> = {
    plain: "bg-card shadow-card",
    sunk: "bg-sunk",
    dark: "bg-ink-panel text-white shadow-float",
    aurora: "wash-aurora shadow-card",
    outline: "bg-card border border-line-strong",
};

export default function Card({
    children,
    className,
    variant = "plain",
    padded = true,
}: {
    children: ReactNode;
    className?: string;
    variant?: Variant;
    padded?: boolean;
}) {
    return (
        <section
            className={cn(
                "min-w-0 rounded-card",
                VARIANTS[variant],
                padded && "p-4 sm:p-5",
                className,
            )}
        >
            {children}
        </section>
    );
}

/** Заголовок секции: подпись слева, действие справа */
export function CardHeader({
    title,
    hint,
    action,
    className,
}: {
    title: ReactNode;
    hint?: ReactNode;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <header
            className={cn("mb-4 flex items-start justify-between gap-3", className)}
        >
            <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-ink">{title}</h2>
                {hint && (
                    <p className="mt-0.5 truncate text-xs text-ink-faint">{hint}</p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </header>
    );
}

/** Строка «подпись — значение», основа всех сводок */
export function DetailRow({
    label,
    value,
    strong,
    mono,
}: {
    label: ReactNode;
    value: ReactNode;
    strong?: boolean;
    mono?: boolean;
}) {
    return (
        <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
            <span className="shrink-0 text-ink-faint">{label}</span>
            <span
                className={cn(
                    "min-w-0 truncate text-right",
                    strong ? "font-semibold text-ink" : "text-ink",
                    mono && "font-mono text-xs",
                )}
            >
                {value}
            </span>
        </div>
    );
}
