"use client"

import { useRouter } from "next/navigation"
import { useGender } from "@/hooks/useGender"

interface Props {
    pageName: string
}

export default function EmptyPage({ pageName }: Props) {
    const router = useRouter()
    const gender = useGender()

    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7H4C2.9 7 2 7.9 2 9v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2Z" stroke="#a3a3a3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#a3a3a3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[16px] font-semibold text-neutral-900">No {pageName} yet</p>
                <p className="text-[13px] text-neutral-400">
                    When you place an order, it'll show up here.
                </p>
            </div>
            <button
                onClick={() => router.push(`/${gender}`)}
                className="mt-1 rounded-lg bg-neutral-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800"
            >
                Shop now
            </button>
        </div>
    )
}