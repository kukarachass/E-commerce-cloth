import { create } from "zustand"

interface FavAuthModalStore {
    isOpen: boolean
    open: () => void
    close: () => void
}

export const useFavAuthModal = create<FavAuthModalStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}))