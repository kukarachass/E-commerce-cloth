import { create } from "zustand/react"

interface SearchState {
    isSticky: boolean
    setIsSticky: (value: boolean) => void
}

export const useStickyStore = create<SearchState>()((set) => ({
    isSticky: false,
    setIsSticky: (value) => set({ isSticky: value }),
}))