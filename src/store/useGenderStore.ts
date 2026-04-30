import { persist } from "zustand/middleware"
import {create} from "zustand/react";

interface GenderState {
    gender: "men" | "women";
    setGender: (value: "men" | "women") => void;
}

export const useGenderStore = create(
    persist<GenderState>(
        (set) => ({
            gender: "women",
            setGender: (value) => set({ gender: value }),
        }),
        { name: "gender" } // сохраняется в localStorage
    )
)