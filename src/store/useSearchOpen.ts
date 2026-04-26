import { create } from "zustand/react"

interface SearchState {
    searchOpen: boolean
    setSearchOpen: (value: boolean) => void
}

export const useSearchStore = create<SearchState>()((set) => ({
    searchOpen: false,
    setSearchOpen: (value) => set({ searchOpen: value }),
}))