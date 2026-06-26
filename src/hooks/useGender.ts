"use client"

import { useParams } from "next/navigation";
import {isGender} from "@/lib/isGender";
export const GENDERS = ["women", "men"] as const
export type Gender = (typeof GENDERS)[number]

export function useGender() {
    const params = useParams();
    const raw = params?.gender;
    const gender = typeof raw === "string" && isGender(raw) ? raw : "men";
    return gender;
}