// app/(main)/[gender]/page.tsx
import { notFound } from 'next/navigation'
import MainPageClient from "@/components/sections/MainPageClient";

const VALID_GENDERS = ['women', 'men']

export default async function MainPage({ params }: { params: Promise<{ gender: string }> }) {
    const { gender } = await params

    if (!VALID_GENDERS.includes(gender)) {
        notFound()
    }

    return <MainPageClient />
}