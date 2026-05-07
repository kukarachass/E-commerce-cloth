"use client"

import { useState } from "react"

type Tab = "tops" | "jeans" | "bikini" | "shoes"

const tabs: { key: Tab; label: string }[] = [
    { key: "tops", label: "Tops" },
    { key: "jeans", label: "Jeans / Pants" },
    { key: "bikini", label: "Bikini" },
    { key: "shoes", label: "Shoes" },
]

function Table({ headers, rows, accent = false }: {
    headers: string[]
    rows: (string | number)[][]
    accent?: boolean
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-[13px] border-collapse">
                <thead>
                <tr>
                    {headers.map((h, i) => (
                        <th
                            key={i}
                            className="text-left px-3 py-2 font-semibold text-[11px] uppercase tracking-widest text-[#999] border-b border-[#eee] whitespace-nowrap"
                        >
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, ri) => (
                    <tr key={ri} className="group">
                        {row.map((cell, ci) => (
                            <td
                                key={ci}
                                className={`px-3 py-[10px] border-b border-[#f0f0f0] whitespace-nowrap group-hover:bg-[#fafafa] transition-colors
                                        ${ci === 0 ? "font-semibold text-[var(--text)]" : "text-[#444]"}
                                    `}
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default function SizeGuide() {
    const [tab, setTab] = useState<Tab>("tops")

    return (
        <div className="font-[var(--source-sans-3)] text-[var(--text)]">
            {/* Header */}
            <div className="mb-6">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#999] mb-1">Size chart</p>
                <h2 className="text-[20px] font-bold leading-tight">Scotch &amp; Soda — Women</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 mb-6 border-b border-[#eee]">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 text-[13px] font-semibold transition-all duration-150 border-b-2 -mb-px whitespace-nowrap
                            ${tab === t.key
                            ? "border-[var(--text)] text-[var(--text)]"
                            : "border-transparent text-[#999] hover:text-[var(--text)]"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-8">
                {tab === "tops" && (
                    <Table
                        headers={["INT", "EU", "FR", "IT", "UK", "US", "Chest", "Waist", "Hip"]}
                        rows={[
                            ["XS", 34, 36, 40, 6, 4, "80 cm / 31″", "64 cm / 25″", "88 cm / 35″"],
                            ["S",  36, 38, 42, 8, 6, "85 cm / 33″", "69 cm / 27″", "93 cm / 37″"],
                            ["M",  38, 40, 44, 10, 8, "90 cm / 35″", "74 cm / 29″", "98 cm / 39″"],
                            ["L",  40, 42, 46, 12, 10, "95 cm / 37″", "79 cm / 31″", "103 cm / 41″"],
                            ["XL", 42, 44, 48, 14, 12, "100 cm / 39″", "84 cm / 33″", "108 cm / 43″"],
                        ]}
                    />
                )}

                {tab === "jeans" && (
                    <>
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.15em] text-[#999] mb-3">Waist sizing</p>
                            <Table
                                headers={["Waist", "INT", "EU", "FR", "IT", "UK", "US", "Waist meas.", "Hips"]}
                                rows={[
                                    [24, "XS", 34, 34, 38, 6, 4, "61.5 cm / 24″", "85.5 cm / 34″"],
                                    [25, "XS", 34, "34–36", "38–40", 6, 4, "64 cm / 25″", "88 cm / 34″"],
                                    [26, "S",  36, 36, 40, 8, 6, "66.5 cm / 26″", "90.5 cm / 35″"],
                                    [27, "S",  36, "36–38", "40–42", 8, 6, "69 cm / 27″", "93 cm / 36″"],
                                    [28, "M",  38, 38, 42, 10, 8, "71.5 cm / 28″", "95.5 cm / 37″"],
                                    [29, "M",  38, "38–40", "42–44", 10, 8, "74 cm / 29″", "98 cm / 38″"],
                                    [30, "L",  40, 40, 44, 12, 10, "76.5 cm / 30″", "100.5 cm / 39″"],
                                    [31, "L",  40, "40–42", "44–46", 12, 10, "79 cm / 31″", "103 cm / 40″"],
                                    [32, "XL", 42, 42, 46, 14, 12, "81.5 cm / 32″", "105.5 cm / 41″"],
                                ]}
                            />
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.15em] text-[#999] mb-3">Length</p>
                            <Table
                                headers={["Length", "Inner leg"]}
                                rows={[
                                    [30, "76 cm / 30″"],
                                    [32, "81 cm / 32″"],
                                    [34, "86 cm / 34″"],
                                ]}
                            />
                        </div>
                    </>
                )}

                {tab === "bikini" && (
                    <Table
                        headers={["Size", "Chest size"]}
                        rows={[
                            ["XS", "80 cm / 31″"],
                            ["S",  "85 cm / 33″"],
                            ["M",  "90 cm / 35″"],
                            ["L",  "95 cm / 37″"],
                            ["XL", "100 cm / 39″"],
                        ]}
                    />
                )}

                {tab === "shoes" && (
                    <Table
                        headers={["EU", "UK", "US", "Foot length"]}
                        rows={[
                            [36, "3.5", 6,   "23.5 cm / 9.3″"],
                            [37, 4,    "6.5","24.0 cm / 9.4″"],
                            [38, 5,    "7.5","24.5 cm / 9.6″"],
                            [39, 6,    "8.5","25.0 cm / 9.8″"],
                            [40, "6.5",9,    "25.5 cm / 10.0″"],
                            [41, 7,    "9.5","26.0 cm / 10.2″"],
                            [42, "7.5",10,   "26.5 cm / 10.4″"],
                        ]}
                    />
                )}
            </div>
        </div>
    )
}