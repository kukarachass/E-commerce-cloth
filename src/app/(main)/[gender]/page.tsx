// app/(main)/[gender]/page.tsx
import { notFound } from 'next/navigation'
import MainPageClient from "@/components/sections/MainPageClient";
import {getHomePageStore} from "@/mocks/homepageStore";
import {Gender} from "@/hooks/useGender";

const VALID_GENDERS = ['women', 'men']

export default async function MainPage({ params }: { params: Promise<{ gender: Gender }> }) {
    const { gender } = await params
    if (!VALID_GENDERS.includes(gender)) notFound();
    const homePageData = await getHomePageStore(gender);

    return <MainPageClient gender={gender} homePageData={homePageData} />
}