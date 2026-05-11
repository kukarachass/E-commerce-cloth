import {IProduct} from "@/components/product/IProduct";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import cn from "classnames";

interface Props{
    products: IProduct[];
    variant: "catalog" | "collection"
}

export default function CatalogContainer({ products, variant = "catalog" }: Props){
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