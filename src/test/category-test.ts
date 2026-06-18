import {Gender} from "@/store/useGenderStore";
import {db} from "@/db";
import {and, eq} from "drizzle-orm";
import {category} from "@/db/schema";
import {getAllCategoriesWithSubs} from "@/actions/category/categories";

export async function getCategoryWithSubs(gender: Gender, slug: string) {
    if (slug === `${gender}-new-items`) {
        const allCategories = await getAllCategoriesWithSubs({ gender })
        return { name: "New Items", subcategories: allCategories }
    }

    return db.query.category.findFirst({
        where: and(eq(category.gender, gender), eq(category.slug, slug)),
        with: {
            subcategories: {
                orderBy: (cat, { asc }) => [asc(cat.name)],
                with: {
                    subcategories: {
                        orderBy: (cat, { asc }) => [asc(cat.name)],
                    },
                },
            },
        },
    })
}

const response = await getCategoryWithSubs("women", "women-clothing-coats-trenchcoats");
console.log(response);