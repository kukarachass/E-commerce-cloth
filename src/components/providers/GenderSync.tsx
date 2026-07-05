// src/components/providers/GenderSync.tsx
"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"
import { isGender } from "@/lib/isGender"
import { useGenderStore } from "@/store/useGenderStore"

export default function GenderSync() {
    const params = useParams()
    const raw = params?.gender
    const setGender = useGenderStore((s) => s.setGender)

    useEffect(() => {
        if (typeof raw === "string" && isGender(raw)) {
            setGender(raw)
        }
    }, [raw, setGender])

    return null
}