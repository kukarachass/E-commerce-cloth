import {IProduct} from "@/components/product/IProduct";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";

interface Props{
    products: IProduct[];
}

export default function CatalogContainer({ products }: Props){
    return(
        <div className="grid grid-cols-3 gap-4 pb-10">
            {products.map(product => (
                <CatalogProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}