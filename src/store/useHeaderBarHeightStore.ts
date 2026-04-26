import { create } from "zustand/react"

interface MiddleBarHeightState {
    middleBarHeight: number
    setMiddleBarHeight: (value: number) => void
}

interface BottomBarHeightState {
    bottomBarHeight: number
    setBottomBarHeight: (value: number) => void
}

export const useMiddleBarHeight = create<MiddleBarHeightState>()((set) => ({
    middleBarHeight: 0,
    setMiddleBarHeight: (value) => set({ middleBarHeight: value }),
}))

export const useBottomBarHeight = create<BottomBarHeightState>()((set) => ({
    bottomBarHeight: 0,
    setBottomBarHeight: (value) => set({ bottomBarHeight: value }),
}))