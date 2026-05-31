// src/actions/catalog/get-catalog-data.ts
"use server"

import { getCategoryWithSubs } from "@/actions/category/categories"
import { getBrands } from "@/actions/brands/brands"
import { getSizes } from "@/actions/sizes/sizes"
import { getPrice } from "@/actions/price/price"
import { getColors } from "@/actions/color/color"
import { getPatterns } from "@/actions/pattern/pattern"
import { getStyles } from "@/actions/style/style"
import { getDiscounts } from "@/actions/discount/dicount"
import { Gender } from "@/store/useGenderStore"

interface GetCatalogDataProps {
    gender: Gender
    category?: string
}

export async function getCatalogData({ gender, category }: GetCatalogDataProps) {
    const slug = `${gender}-${category}`

    const [categoryData, brands, sizes, price, colors, patterns, styles, discounts] =
        await Promise.all([
            getCategoryWithSubs(gender, slug),
            getBrands({ gender, categorySlug: category }),
            getSizes({ gender, categorySlug: category }),
            getPrice({ gender, categorySlug: category }),
            getColors({ gender, categorySlug: category }),
            getPatterns({ gender, categorySlug: category }),
            getStyles({ gender, categorySlug: category }),
            getDiscounts({ gender, categorySlug: category }),
        ])

    return { categoryData, brands, sizes, price, colors, patterns, styles, discounts }
}