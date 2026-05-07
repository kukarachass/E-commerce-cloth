// store/useFilterStore.ts
import { create } from "zustand/react"

export type Sort = "popularity" | "new" | "new discount" | "price: high to low" | "price: low to high"
type ArrayFilterKey = "brands" | "sizes" | "colours" | "patterns" | "styles" | "discounts"


interface FilterState {
    sort: Sort     // одно значение
    brands: string[]
    sizes: string[]
    colours: string[]
    priceMin: number
    priceMax: number
    patterns: string[]
    styles: string[]
    discounts: string[]

    setSort: (sort: Sort) => void;
    toggleBrand: (brand: string) => void
    toggleSize: (size: string) => void
    toggleColour: (colour: string) => void
    togglePattern: (pattern: string) => void
    toggleStyle: (style: string) => void
    toggleDiscount: (discount: string) => void
    setPrice: (min: number, max: number) => void
    clearFilter: (key: ArrayFilterKey) => void
    clearAll: () => void
}

const toggle = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]

export const useFiltersStore = create<FilterState>()((set) => ({
    sort: "popularity",
    brands: [],
    sizes: [],
    colours: [],
    priceMin: 0,
    priceMax: 1000,
    patterns: [],
    styles: [],
    discounts: [],

    setSort: (value: Sort) => set({sort: value}),
    toggleBrand: (brand) => set(s => ({ brands: toggle(s.brands, brand) })),
    toggleSize: (size) => set(s => ({ sizes: toggle(s.sizes, size) })),
    toggleColour: (colour) => set(s => ({ colours: toggle(s.colours, colour) })),
    togglePattern: (pattern) => set(s => ({ patterns: toggle(s.patterns, pattern) })),
    toggleStyle: (style) => set(s => ({ styles: toggle(s.styles, style) })),
    toggleDiscount: (discount) => set(s => ({ discounts: toggle(s.discounts, discount) })),
    setPrice: (min, max) => set({ priceMin: min, priceMax: max }),

    clearFilter: (key) => set({ [key]: [] }),
    clearAll: () => set({ brands: [], sizes: [], colours: [], priceMin: 0, priceMax: 1000, patterns: [], styles: [], discounts: [] }),
}))