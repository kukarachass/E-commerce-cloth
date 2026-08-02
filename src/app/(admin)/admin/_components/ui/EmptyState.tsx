import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import cn from "@/app/(admin)/admin/_lib/cn";

export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
    compact,
}: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
    compact?: boolean;
}) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-card text-center",
                compact ? "gap-2 py-8" : "gap-3 py-14",
                className,
            )}
        >
            {Icon && (
                <span className="hatch mb-1 grid h-12 w-12 place-items-center rounded-full bg-sunk text-ink-faint">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
            )}
            <p className="text-sm font-medium text-ink">{title}</p>
            {description && (
                <p className="max-w-xs text-xs leading-relaxed text-ink-faint">
                    {description}
                </p>
            )}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
