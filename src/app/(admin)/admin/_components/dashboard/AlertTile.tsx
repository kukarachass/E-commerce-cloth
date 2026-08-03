import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import cn from "@/app/(admin)/admin/_lib/cn";

type Tone = "accent" | "caution" | "info";

const TONES: Record<Tone, { icon: string; value: string }> = {
    accent: { icon: "bg-accent-soft text-accent-deep", value: "text-accent" },
    caution: { icon: "bg-caution-soft text-caution", value: "text-caution" },
    info: { icon: "bg-info-soft text-info", value: "text-info" },
};

/** Плитка «требует внимания»: число, что это значит и куда идти чинить */
export default function AlertTile({
    icon: Icon,
    value,
    label,
    hint,
    href,
    tone = "accent",
}: {
    icon: LucideIcon;
    value: number | string;
    label: string;
    hint: string;
    href: string;
    tone?: Tone;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3.5 rounded-card bg-card p-3.5 shadow-card transition-transform duration-200 hover:-translate-y-0.5"
        >
            <span
                className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-full",
                    TONES[tone].icon,
                )}
            >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </span>

            <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-1.5">
                    <span
                        className={cn(
                            "tnum text-xl leading-none font-semibold",
                            TONES[tone].value,
                        )}
                    >
                        {value}
                    </span>
                    <span className="truncate text-sm font-medium text-ink">
                        {label}
                    </span>
                </span>
                <span className="mt-1 block truncate text-xs text-ink-faint">
                    {hint}
                </span>
            </span>

            <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
        </Link>
    );
}
