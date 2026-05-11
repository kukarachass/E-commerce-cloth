import { persist } from "zustand/middleware"
import { create } from "zustand/react"

interface ToggleListState {
    items: string[];
    toggle: (id: string) => void;
}

const toggleItem = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]

const createToggleStore = (name: string) =>
    create(
        persist<ToggleListState>(
            (set) => ({
                items: [],
                toggle: (value) => set(s => ({ items: toggleItem(s.items, value) })),
            }),
            { name }
        )
    )

export const useFavoritesStore = createToggleStore("favorites")
export const useFavoriteBrandsStore = createToggleStore("favorite-brands")