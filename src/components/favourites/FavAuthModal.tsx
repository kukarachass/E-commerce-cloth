"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useFavAuthModal } from "@/store/useFavAuthModal"
import { X } from "lucide-react"
import Image from "next/image"
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";

export default function FavAuthModal() {
    const { isOpen, close } = useFavAuthModal()
    const router = useRouter()

    useEffect(() => {
        if (!isOpen) return
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isOpen, close])

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    if (!isOpen) return null

    const handleNavigate = (path: string) => {
        close()
        router.push(path)
    }

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            onClick={close}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative z-10 flex w-full max-w-[600px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Hero Image */}
                <div className="relative h-[320px] w-full shrink-0">
                    <Image
                        src="/banners/modal-banner.jpeg"
                        alt="Favourites"
                        fill
                        className="object-cover object-top"
                        priority
                    />

                    {/* Close button поверх картинки */}
                    <button
                        onClick={close}
                        className="cursor-pointer absolute right-3 top-3 flex h-9 w-9 items-center justify-center text-white hover:opacity-50 transition-opacity duration-300"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center px-8 pb-8 pt-7 text-center">
                    <h2 className="mb-2.5 text-[22px] font-bold leading-snug text-[var(--text)]">
                        Sign in to save your favorites
                    </h2>
                    <p className="mb-7 text-[14px] leading-relaxed text-gray-500">
                        Add products and brands to your favorites and come back to them anytime.
                    </p>

                    <div className="flex w-full flex-col gap-3">
                        <ButtonPrimary
                            variant={"primary"}
                            onClick={() => handleNavigate("/auth?method=sign-in")}
                        >
                            Log in
                        </ButtonPrimary>
                        <ButtonPrimary
                            onClick={() => handleNavigate("/auth?method=sign-up")}
                            variant={"secondary"}
                        >
                            Register
                        </ButtonPrimary>
                    </div>
                </div>
            </div>
        </div>
    )
}