"use server"

import { getCategoryIds } from "@/lib/db-helpers"
import { db } from "@/db"
import { product, productSize } from "@/db/schema"
import { and, eq, inArray } from "drizzle-orm"
import { FilterProps } from "@/types/filters/filters-props"

export async function getSizes({ gender, categorySlug, productIds }: FilterProps) {
    const categoryIds =
        !categorySlug || categorySlug === "new-items"
            ? undefined
            : await getCategoryIds(gender, categorySlug)

    const filter =
        productIds
            ? inArray(productSize.productId, productIds)
            : categoryIds
                ? inArray(product.categoryId, categoryIds)
                : undefined

    return db
        .selectDistinct({
            id:         productSize.id,
            size:       productSize.size,
            sizeSystem: productSize.sizeSystem,
        })
        .from(productSize)
        .innerJoin(
            product,
            and(
                eq(productSize.productId, product.id),
                eq(product.gender, gender),
                filter,
                eq(product.isActive, true),
            ),
        )
        .orderBy(productSize.sizeSystem, productSize.size)
}