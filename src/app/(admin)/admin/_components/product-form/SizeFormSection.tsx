"use client"


import {SizeRow} from "@/app/(admin)/admin/_components/products/ProductForm";

interface SizeFormSectionProps{
    error?: string;
    sizes: SizeRow[];
    setSizes: React.Dispatch<React.SetStateAction<SizeRow[]>>;
}


const SIZE_SYSTEMS = [
    "INT", "UK", "EU", "US", "FR", "IT", "DE",
    "Waist", "Waist/Length", "Other", "Years", "Size (cm)",
];

const emptySize: SizeRow = { size: "", sizeSystem: "EU", stockAmount: 0 };

export default function SizeFormSection({ error, sizes, setSizes }: SizeFormSectionProps){
    return(
        <div>
            <div className="mb-2 text-sm text-gray-600">Размеры</div>
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            {sizes.map((s, i) => (
                <div key={i} className="flex gap-2 mb-2">
                    <input
                        placeholder="M"
                        value={s.size}
                        onChange={(e) => setSizes(upd(sizes, i, { size: e.target.value }))}
                        className="border rounded-md px-3 py-2 w-24"
                    />
                    <select
                        value={s.sizeSystem}
                        onChange={(e) => setSizes(upd(sizes, i, { sizeSystem: e.target.value }))}
                        className="border rounded-md px-3 py-2"
                    >
                        {SIZE_SYSTEMS.map((x) => (
                            <option key={x} value={x}>{x}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min={0}
                        value={s.stockAmount}
                        onChange={(e) =>
                            setSizes(upd(sizes, i, { stockAmount: Number(e.target.value) }))
                        }
                        className="border rounded-md px-3 py-2 w-24"
                    />
                    <button
                        type="button"
                        onClick={() => setSizes(sizes.filter((_, x) => x !== i))}
                        className="px-3 text-gray-500 hover:text-red-600"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => setSizes([...sizes, emptySize])}
                className="text-sm text-blue-600"
            >
                + размер
            </button>
        </div>
    )
}

function upd(rows: SizeRow[], i: number, patch: Partial<SizeRow>) {
    return rows.map((r, j) => (j === i ? { ...r, ...patch } : r));
}