// app/(main)/[gender]/brands/page.tsx

import {getBrands} from "@/actions/brands/brands";
import BrandsPage from "@/components/brand-page/BrandsPage";
import {Gender} from "@/store/useGenderStore";

export default async function Page({ params }: { params: Promise<{ gender: Gender }> }) {
    const { gender } = await params;
    const brands = await getBrands({ gender })

    // Группируем по первой букве
    const sections = brands.reduce((acc, brand) => {
        const firstLetter = brand.name[0].toUpperCase()
        const key = /[A-Z]/.test(firstLetter) ? firstLetter : "#"

        if (!acc[key]) acc[key] = []
        acc[key].push(brand)

        return acc
    }, {} as Record<string, typeof brands>)

    return <BrandsPage sections={sections} />
}