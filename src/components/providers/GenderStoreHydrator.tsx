// src/components/providers/GenderStoreHydrator.tsx
"use client"

import { useEffect } from "react"
import { useGenderStore } from "@/store/useGenderStore"

export default function GenderStoreHydrator() {
    useEffect(() => {
        useGenderStore.persist.rehydrate()
    }, [])
    return null
}