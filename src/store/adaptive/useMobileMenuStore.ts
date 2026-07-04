import { create } from "zustand"

interface MobileMenuState {
    isOpen: boolean
    setOpen: (open: boolean) => void
}

export const useMobileMenuStore = create<MobileMenuState>((set) => ({
    isOpen: false,
    setOpen: (open) => set({ isOpen: open }),
}))