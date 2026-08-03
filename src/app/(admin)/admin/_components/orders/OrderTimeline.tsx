import { Ban, Check, RotateCcw } from "lucide-react";
import cn from "@/app/(admin)/admin/_lib/cn";
import {
    FULFILLMENT_FLOW,
    FULFILLMENT_LABELS,
} from "@/app/(admin)/admin/_lib/labels";
import type { OrderFulfillmentStatus } from "@/types/IOrder";

/**
 * Путь заказа по стадиям сборки. Отменённый и возвращённый выпадают из
 * линейного потока — для них показываем отдельное состояние, а не пустую шкалу.
 */
export default function OrderTimeline({
    status,
}: {
    status: OrderFulfillmentStatus;
}) {
    if (status === "cancelled" || status === "returned") {
        const cancelled = status === "cancelled";
        const Icon = cancelled ? Ban : RotateCcw;

        return (
            <div
                className={cn(
                    "flex items-center gap-3 rounded-card px-4 py-3.5",
                    cancelled ? "bg-critical-soft" : "bg-caution-soft",
                )}
            >
                <span
                    className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                        cancelled
                            ? "bg-critical text-white"
                            : "bg-caution text-white",
                    )}
                >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <div>
                    <p
                        className={cn(
                            "text-sm font-semibold",
                            cancelled ? "text-critical" : "text-caution",
                        )}
                    >
                        {FULFILLMENT_LABELS[status]}
                    </p>
                    <p className="text-xs text-ink-soft">
                        {cancelled
                            ? "Stock was returned to inventory."
                            : "Items came back and stock was restored."}
                    </p>
                </div>
            </div>
        );
    }

    const current = FULFILLMENT_FLOW.indexOf(status);

    return (
        <ol className="flex items-center">
            {FULFILLMENT_FLOW.map((step, i) => {
                const done = i < current;
                const active = i === current;

                return (
                    <li
                        key={step}
                        className={cn("flex min-w-0 items-center", i > 0 && "flex-1")}
                    >
                        {i > 0 && (
                            <span
                                className={cn(
                                    "mx-1.5 h-0.5 flex-1 rounded-full sm:mx-2",
                                    done || active ? "bg-ink-panel" : "bg-line-strong",
                                )}
                            />
                        )}

                        <span className="flex min-w-0 flex-col items-center gap-1.5">
                            <span
                                className={cn(
                                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-colors",
                                    done && "bg-ink-panel text-white",
                                    active && "bg-accent text-white ring-4 ring-accent-soft",
                                    !done && !active && "bg-sunk text-ink-faint",
                                )}
                            >
                                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                            </span>
                            <span
                                className={cn(
                                    "max-w-[70px] truncate text-center text-[11px] sm:max-w-none",
                                    active
                                        ? "font-semibold text-ink"
                                        : "text-ink-faint",
                                )}
                            >
                                {FULFILLMENT_LABELS[step]}
                            </span>
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
