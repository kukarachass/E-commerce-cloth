// store/useGenderStore.ts
import { create } from "zustand/react"
import { persist } from "zustand/middleware"

// store/useGenderStore.ts  (или отдельный lib/gender.ts)

// один массив — из него выводим и тип, и список для проверки
export const GENDERS = ["women", "men"] as const   // ← подставь свои реальные значения
export type Gender = (typeof GENDERS)[number]

// type guard: возвращает "value is Gender" — после него TS САМ знает, что это Gender
export function isGender(value: string): value is Gender {
    return (GENDERS as readonly string[]).includes(value)
}

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