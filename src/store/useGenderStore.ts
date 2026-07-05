// src/store/useGenderStore.ts
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { Gender } from "@/hooks/useGender"

interface GenderState {
    gender: Gender
    hasHydrated: boolean
    setGender: (gender: Gender) => void
    setHasHydrated: (state: boolean) => void
}

export const useGenderStore = create<GenderState>()(
    persist(
        (set) => ({
            gender: "men",
            hasHydrated: false,
            setGender: (gender) => set({ gender }),
            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: "gender-storage",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true, // критично: не трогаем localStorage до явного вызова rehydrate()
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            },
        }
    )
)