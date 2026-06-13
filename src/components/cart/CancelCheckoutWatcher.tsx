"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cancelPendingCheckout } from "@/actions/checkout/cancelPendingCheckout"

export default function CancelCheckoutWatcher() {
    const params = useSearchParams()
    const router = useRouter()
    const done = useRef(false)

    useEffect(() => {
        const canceled = params.get("canceled")
        if (!canceled || done.current) return
        done.current = true // защита от двойного вызова в строгом режиме
        cancelPendingCheckout(canceled).finally(() => router.replace("/cart"))
    }, [params, router])

    return null
}