import { create } from "zustand"

interface MobileFilterState {
    isOpen: boolean
    setOpen: (open: boolean) => void
}

export const useMobileFilterStore = create<MobileFilterState>((set) => ({
    isOpen: false,
    setOpen: (open) => set({ isOpen: open }),
}))