"use client";

import { Plus, Trash2 } from "lucide-react";
import type { SizeRow } from "@/app/(admin)/admin/_components/products/ProductForm";
import Button from "@/app/(admin)/admin/_components/ui/Button";
import { Input, Select } from "@/app/(admin)/admin/_components/ui/Form";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import cn from "@/app/(admin)/admin/_lib/cn";

const SIZE_SYSTEMS = [
    "INT",
    "UK",
    "EU",
    "US",
    "FR",
    "IT",
    "DE",
    "Waist",
    "Waist/Length",
    "Other",
    "Years",
    "Size (cm)",
];

export const emptySize: SizeRow = { size: "", sizeSystem: "EU", stockAmount: 0 };

function patch(rows: SizeRow[], index: number, next: Partial<SizeRow>) {
    return rows.map((row, i) => (i === index ? { ...row, ...next } : row));
}

export default function SizeFormSection({
    error,
    sizes,
    setSizes,
}: {
    error?: string;
    sizes: SizeRow[];
    setSizes: React.Dispatch<React.SetStateAction<SizeRow[]>>;
}) {
    const totalStock = sizes.reduce((sum, s) => sum + (s.stockAmount || 0), 0);

    return (
        <div className="grid grid-cols-1 gap-2.5">
            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-ink-soft">
                    Sizes &amp; stock
                </span>
                <Badge tone={totalStock > 0 ? "neutral" : "caution"}>
                    {totalStock} in stock
                </Badge>
            </div>

            {error && <p className="text-xs text-critical">{error}</p>}

            <ul className="grid grid-cols-1 gap-2">
                {sizes.map((row, i) => (
                    <li
                        key={i}
                        className={cn(
                            "grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-field bg-sunk p-2",
                            "sm:grid-cols-[110px_minmax(0,1fr)_120px_auto] sm:items-center",
                        )}
                    >
                        <Input
                            value={row.size}
                            placeholder="M"
                            aria-label="Size"
                            onChange={(e) =>
                                setSizes(patch(sizes, i, { size: e.target.value }))
                            }
                        />

                        <Select
                            value={row.sizeSystem}
                            aria-label="Size system"
                            className="max-sm:col-span-2"
                            onChange={(e) =>
                                setSizes(patch(sizes, i, { sizeSystem: e.target.value }))
                            }
                        >
                            {SIZE_SYSTEMS.map((system) => (
                                <option key={system} value={system}>
                                    {system}
                                </option>
                            ))}
                        </Select>

                        <Input
                            type="number"
                            min={0}
                            value={row.stockAmount}
                            aria-label="Stock amount"
                            onChange={(e) =>
                                setSizes(
                                    patch(sizes, i, {
                                        stockAmount: Number(e.target.value),
                                    }),
                                )
                            }
                        />

                        <button
                            type="button"
                            aria-label="Remove size"
                            onClick={() => setSizes(sizes.filter((_, j) => j !== i))}
                            className="grid grid-cols-1 h-11 w-11 place-items-center rounded-full text-ink-faint transition-colors hover:bg-critical-soft hover:text-critical"
                        >
                            <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                        </button>
                    </li>
                ))}
            </ul>

            <Button
                variant="soft"
                size="sm"
                className="justify-self-start"
                onClick={() => setSizes([...sizes, emptySize])}
            >
                <Plus className="h-3.5 w-3.5" />
                Add size
            </Button>
        </div>
    );
}
