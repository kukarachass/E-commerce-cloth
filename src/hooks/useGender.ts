// src/hooks/useGender.ts
"use client"

import { useParams } from "next/navigation";
import { isGender } from "@/lib/isGender";
import { useGenderStore } from "@/store/useGenderStore";

export const GENDERS = ["women", "men"] as const
export type Gender = (typeof GENDERS)[number]

export function useGender(): Gender {
    const params = useParams();
    const raw = params?.gender;
    const storeGender = useGenderStore((s) => s.gender)

    if (typeof raw === "string" && isGender(raw)) return raw
    return storeGender
}