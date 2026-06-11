"use client"

import Image from "next/image"
import { useState, useCallback } from "react"
import { productImages } from "@/types/product-details"

interface ProductImageGalleryProps {
    images: productImages[]
    alt: string
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)

    const openLightbox = (index: number) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
    }

    const closeLightbox = () => setLightboxOpen(false)

    const prev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation()
        setLightboxIndex(i => (i - 1 + images.length) % images.length)
    }, [images.length])

    const next = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation()
        setLightboxIndex(i => (i + 1) % images.length)
    }, [images.length])

    if (images.length === 0) return null

    const imgCard = (image: productImages, index: number, key: string) => (
        <div
            key={key}
            className="relative w-full aspect-[3/4] overflow-hidden rounded cursor-zoom-in group"
            onClick={() => openLightbox(index)}
        >
            <Image
                src={image.url}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
        </div>
    )

    const renderGrid = () => {
        if (images.length === 1) return imgCard(images[0], 0, "0")

        const blocks: React.ReactNode[] = []
        let i = 0

        while (i < images.length) {
            if (i + 1 < images.length) {
                blocks.push(
                    <div key={`pair-${i}`} className="grid grid-cols-2 gap-2">
                        {imgCard(images[i], i, `${i}`)}
                        {imgCard(images[i + 1], i + 1, `${i + 1}`)}
                    </div>
                )
                i += 2
            }

            if (i < images.length) {
                blocks.push(imgCard(images[i], i, `${i}`))
                i += 1
            }
        }

        return <div className="flex flex-col gap-2">{blocks}</div>
    }

    return (
        <>
            {renderGrid()}

            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors z-10"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 2L14 14M14 2L2 14" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>

                    {images.length > 1 && (
                        <button
                            onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors z-10"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 3L5 8L10 13" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}

                    <div
                        className="relative w-full max-w-[500px] h-[80vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        <Image
                            src={images[lightboxIndex].url}
                            alt={`${alt} ${lightboxIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    {images.length > 1 && (
                        <button
                            onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors z-10"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 3L11 8L6 13" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}

                    {images.length > 1 && (
                        <div className="absolute bottom-6 flex items-center gap-2">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={e => { e.stopPropagation(); setLightboxIndex(i) }}
                                    className={`h-[3px] rounded-full transition-all duration-200 ${
                                        i === lightboxIndex
                                            ? "w-8 bg-[#1c1917]"
                                            : "w-5 bg-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}