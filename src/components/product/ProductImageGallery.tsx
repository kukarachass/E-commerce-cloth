"use client"

import Image from "next/image"
import { useState, useCallback } from "react"

interface ProductImageGalleryProps {
    images: string[]
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

    // Layout: pair, full, pair, full, ...
    const renderGrid = () => {
        const imgCard = (src: string, index: number, key: string) => (
            <div
                key={key}
                className="relative w-full aspect-[3/4] overflow-hidden rounded cursor-zoom-in group"
                onClick={() => openLightbox(index)}
            >
                <Image
                    src={src}
                    alt={`${alt} ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
            </div>
        )

        if (images.length === 1) return imgCard(images[0], 0, "0")

        const blocks: React.ReactNode[] = []
        let i = 0

        while (i < images.length) {
            // pair
            if (i + 1 < images.length) {
                blocks.push(
                    <div key={`pair-${i}`} className="grid grid-cols-2 gap-2">
                        {imgCard(images[i], i, `${i}`)}
                        {imgCard(images[i + 1], i + 1, `${i + 1}`)}
                    </div>
                )
                i += 2
            }
            // full
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

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors z-10"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 2L14 14M14 2L2 14" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>

                    {/* Prev */}
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

                    {/* Image */}
                    <div
                        className="relative w-full max-w-[500px] h-[80vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        <Image
                            src={images[lightboxIndex]}
                            alt={`${alt} ${lightboxIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Next */}
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

                    {/* Dots */}
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