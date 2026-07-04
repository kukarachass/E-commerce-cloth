import { create } from "zustand"

interface CatalogSidebarState {
    isOpen: boolean
    setOpen: (open: boolean) => void
}

export const useCatalogSidebarStore = create<CatalogSidebarState>((set) => ({
    isOpen: false,
    setOpen: (open) => set({ isOpen: open }),
}))