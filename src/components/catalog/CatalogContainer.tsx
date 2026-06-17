import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import cn from "classnames";
import {ProductWithDetails} from "@/types/product-details";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {category} from "@/db/schema";

interface Props{
    products: ProductWithDetails[];
    variant?: "catalog" | "collection"
}

export default async function CatalogContainer({ products, variant = "catalog" }: Props){
    const cats = await db.query.category.findMany({
        where: eq(category.gender, "women"),
        columns: { name: true, slug: true, parentId: true },
    })
    console.log("cats ------>",cats)
    return(
        <div className={cn("grid grid-cols-3 gap-4 pb-10", {
            ["grid grid-cols-4 gap-6"]: variant === "collection",
        })}>
            {products.map(product => (
                <CatalogProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}