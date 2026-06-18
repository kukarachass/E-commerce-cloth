// lib/size-mapping.ts

export type SizeSystem =
    | "INT" | "UK" | "EU" | "US" | "FR" | "IT" | "DE"
    | "Waist" | "Waist/Length" | "Other" | "Years" | "Size (cm)"

export type SizeRow = {
    productId: string
    size: string
    sizeSystem: SizeSystem
    stockAmount: number
}

// ─── ОДЕЖДА + СПОРТИВНАЯ ОДЕЖДА ───────────────────────────────────────────────
const clothingSizeMap: Record<string, Partial<Record<SizeSystem, string[]>>> = {
    XXS: {
        INT: ["XXS"],
        UK:  ["4"],
        EU:  ["30", "32"],
        US:  ["00"],
        FR:  ["34"],
        IT:  ["34"],
        DE:  ["30", "32"],
        Other: ["XXS"],
    },
    XS: {
        INT: ["XS"],
        UK:  ["6"],
        EU:  ["32", "34"],
        US:  ["0", "2"],
        FR:  ["36"],
        IT:  ["36"],
        DE:  ["32", "34"],
        Waist: ["23", "24", "25", "W24", "W25"],
        "Waist/Length": ["W24L28", "W24L30", "W24L32", "W25L28", "W25L30", "W25L32"],
        Other: ["XS"],
    },
    S: {
        INT: ["S"],
        UK:  ["8", "10"],
        EU:  ["36", "38"],
        US:  ["4", "6"],
        FR:  ["38"],
        IT:  ["38"],
        DE:  ["34", "36"],
        Waist: ["26", "27", "W26", "W27"],
        "Waist/Length": ["W26L28", "W26L30", "W26L32", "W27L28", "W27L30", "W27L32"],
        Other: ["S"],
    },
    M: {
        INT: ["M"],
        UK:  ["12", "14"],
        EU:  ["38", "40"],
        US:  ["6", "8"],
        FR:  ["40", "42"],
        IT:  ["40", "42"],
        DE:  ["36", "38", "40"],
        Waist: ["28", "29", "30", "W28", "W29", "W30"],
        "Waist/Length": [
            "W28L28", "W28L30", "W28L32",
            "W29L28", "W29L30", "W29L32",
            "W30L28", "W30L30", "W30L32",
        ],
        Other: ["M"],
    },
    L: {
        INT: ["L"],
        UK:  ["16", "18"],
        EU:  ["40", "42", "44"],
        US:  ["10", "12"],
        FR:  ["42", "44"],
        IT:  ["42", "44"],
        DE:  ["40", "42"],
        Waist: ["31", "32", "33", "W31", "W32", "W33"],
        "Waist/Length": [
            "W31L30", "W31L32",
            "W32L28", "W32L30", "W32L32",
            "W33L30", "W33L32",
        ],
        Other: ["L"],
    },
    XL: {
        INT: ["XL"],
        UK:  ["18", "20"],
        EU:  ["44", "46"],
        US:  ["14", "16"],
        FR:  ["44", "46"],
        IT:  ["44", "46"],
        DE:  ["42", "44"],
        Waist: ["34", "36", "W34", "W36"],
        "Waist/Length": ["W34L28", "W34L30", "W34L32", "W36L30", "W36L32"],
        Other: ["XL"],
    },
    XXL: {
        INT: ["XXL"],
        UK:  ["20", "22"],
        EU:  ["46", "48"],
        US:  ["16", "18"],
        FR:  ["46", "48"],
        IT:  ["46", "48"],
        DE:  ["44", "46"],
        Waist: ["38", "40", "W38", "W40"],
        "Waist/Length": ["W38L30", "W38L32", "W40L30", "W40L32"],
    },
    "3XL": {
        INT: ["3XL"],
        UK:  ["22", "24"],
        EU:  ["48", "50"],
        US:  ["18", "20"],
        FR:  ["48", "50"],
        IT:  ["48", "50"],
        DE:  ["46", "52"],
        Waist: ["42", "44", "W42", "W44"],
        "Waist/Length": ["W42L30", "W42L32"],
    },
    "4XL": {
        INT: ["4XL"],
        UK:  ["24"],
        EU:  ["50", "52"],
        US:  ["20"],
        FR:  ["50", "52"],
        IT:  ["50", "52"],
        DE:  ["52", "54"],
        Waist: ["46", "W46"],
    },
    "5XL": {
        INT: ["5XL"],
        EU:  ["52", "54"],
        FR:  ["52", "54"],
        IT:  ["52", "54"],
        DE:  ["54"],
        Waist: ["48", "W48"],
    },
}

// ─── ОБУВЬ ────────────────────────────────────────────────────────────────────
const shoeSizeMap: Record<string, Partial<Record<SizeSystem, string[]>>> = {
    "35":   { EU: ["35"],   UK: ["2"],    US: ["4",    "4.5"],  FR: ["35"],   IT: ["35"],   DE: ["35"]   },
    "35.5": { EU: ["35.5"], UK: ["2.5"],  US: ["4.5",  "5"],    FR: ["35.5"], IT: ["35.5"], DE: ["35.5"] },
    "36":   { EU: ["36"],   UK: ["3"],    US: ["5",    "5.5"],  FR: ["36"],   IT: ["36"],   DE: ["36"]   },
    "36.5": { EU: ["36.5"], UK: ["3.5"],  US: ["5.5",  "6"],    FR: ["36.5"], IT: ["36.5"], DE: ["36.5"] },
    "37":   { EU: ["37"],   UK: ["4"],    US: ["6",    "6.5"],  FR: ["37"],   IT: ["37"],   DE: ["37"]   },
    "37.5": { EU: ["37.5"], UK: ["4.5"],  US: ["6.5",  "7"],    FR: ["37.5"], IT: ["37.5"], DE: ["37.5"] },
    "38":   { EU: ["38"],   UK: ["5"],    US: ["7",    "7.5"],  FR: ["38"],   IT: ["38"],   DE: ["38"]   },
    "38.5": { EU: ["38.5"], UK: ["5.5"],  US: ["7.5",  "8"],    FR: ["38.5"], IT: ["38.5"], DE: ["38.5"] },
    "39":   { EU: ["39"],   UK: ["6"],    US: ["8",    "8.5"],  FR: ["39"],   IT: ["39"],   DE: ["39"]   },
    "39.5": { EU: ["39.5"], UK: ["6.5"],  US: ["8.5",  "9"],    FR: ["39.5"], IT: ["39.5"], DE: ["39.5"] },
    "40":   { EU: ["40"],   UK: ["6.5"],  US: ["8.5",  "9"],    FR: ["40"],   IT: ["40"],   DE: ["40"]   },
    "40.5": { EU: ["40.5"], UK: ["7"],    US: ["9",    "9.5"],  FR: ["40.5"], IT: ["40.5"], DE: ["40.5"] },
    "41":   { EU: ["41"],   UK: ["7"],    US: ["9",    "9.5"],  FR: ["41"],   IT: ["41"],   DE: ["41"]   },
    "41.5": { EU: ["41.5"], UK: ["7.5"],  US: ["9.5",  "10"],   FR: ["41.5"], IT: ["41.5"], DE: ["41.5"] },
    "42":   { EU: ["42"],   UK: ["8"],    US: ["10",   "10.5"], FR: ["42"],   IT: ["42"],   DE: ["42"]   },
    "42.5": { EU: ["42.5"], UK: ["8.5"],  US: ["10.5", "11"],   FR: ["42.5"], IT: ["42.5"], DE: ["42.5"] },
    "43":   { EU: ["43"],   UK: ["9"],    US: ["10.5", "11"],   FR: ["43"],   IT: ["43"],   DE: ["43"]   },
    "44":   { EU: ["44"],   UK: ["10"],   US: ["11",   "11.5"], FR: ["44"],   IT: ["44"],   DE: ["44"]   },
    "45":   { EU: ["45"],   UK: ["11"],   US: ["12",   "12.5"], FR: ["45"],   IT: ["45"],   DE: ["45"]   },
    "46":   { EU: ["46"],   UK: ["11.5"], US: ["12.5", "13"],   FR: ["46"],   IT: ["46"],   DE: ["46"]   },
    "47":   { EU: ["47"],   UK: ["12"],   US: ["13",   "13.5"], FR: ["47"],   IT: ["47"],   DE: ["47"]   },
}

// ─── АКСЕССУАРЫ ───────────────────────────────────────────────────────────────
const accessoriesSizeMap: Partial<Record<SizeSystem, string[]>> = {
    INT:        ["OS", "XS", "S", "M", "L", "XL"],
    UK:         ["8", "10", "12", "14", "16"],
    EU:         ["34"],
    IT:         ["38", "40", "42", "44", "46", "48"],
    "Size (cm)":["60", "65", "70", "75", "80", "85", "90", "95", "100", "105", "110", "115"],
}

const SHOES_KEYWORDS = [
    "shoes", "sneakers", "boots", "sandals", "heels",
    "loafers", "flats", "pumps", "slippers", "mules", "wedges",
]
const ACCESSORIES_KEYWORDS = [
    "accessories", "bags", "bag", "belts", "belt", "scarves", "scarf",
    "hats", "hat", "cap", "sunglasses", "jewellery", "jewelry",
    "watches", "watch", "gloves", "socks", "tights",
]

function resolveCategoryType(slug: string): "shoes" | "accessories" | "clothing" {
    const s = slug.toLowerCase()
    if (SHOES_KEYWORDS.some(kw => s.includes(kw)))       return "shoes"
    if (ACCESSORIES_KEYWORDS.some(kw => s.includes(kw))) return "accessories"
    return "clothing"
}

export function generateSizeRows(productId: string, categorySlug: string): SizeRow[] {
    const seen = new Set<string>()
    const rows: SizeRow[] = []

    const add = (size: string, sizeSystem: SizeSystem) => {
        const key = `${sizeSystem}:${size}`
        if (seen.has(key)) return
        seen.add(key)
        rows.push({ productId, size, sizeSystem, stockAmount: 5 })
    }

    const type = resolveCategoryType(categorySlug)
    const map = type === "shoes" ? shoeSizeMap
        : type === "accessories" ? accessoriesSizeMap as Record<string, string[]>
            : clothingSizeMap

    if (type === "accessories") {
        for (const [system, sizes] of Object.entries(accessoriesSizeMap)) {
            for (const size of sizes!) add(size, system as SizeSystem)
        }
        return rows
    }

    for (const systems of Object.values(map as Record<string, Partial<Record<SizeSystem, string[]>>>)) {
        for (const [system, sizes] of Object.entries(systems)) {
            for (const size of sizes!) add(size, system as SizeSystem)
        }
    }

    return rows
}

// "EU:38" → { system: "EU", size: "38" }
export function parseSizeFilter(raw: string): { system: SizeSystem; size: string } | null {
    const idx = raw.indexOf(":")
    if (idx === -1) return null
    const system = raw.slice(0, idx) as SizeSystem
    const size   = raw.slice(idx + 1)
    if (!system || !size) return null
    return { system, size }
}