// store/useGenderStore.ts
import { create } from "zustand/react"
import { persist } from "zustand/middleware"

type Gender = "women" | "men"

interface GenderState {
    gender: Gender
    setGender: (gender: Gender) => void
}

export const useGenderStore = create(
    persist<GenderState>(
        (set) => ({
            gender: "women",
            setGender: (gender) => set({ gender }),
        }),
        { name: "gender" }
    )
)