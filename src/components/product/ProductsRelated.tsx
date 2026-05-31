import Slider from "@/components/Slider/Slider";
import ProductCard from "@/components/product/ProductCard";
import {IProduct} from "@/components/product/IProduct";

interface Props {
    products: IProduct[];
    currentId: string | string[];
    type: "related" | "complete-look";
}

export default function ProductsRelated({ products, currentId, type}: Props) {

    const filteredProducts = products.filter((p) => p.id !== currentId)
    return (
        <div className="flex flex-col max-w-[1200px]">
            {type === "related" ? (
                <div className="flex flex-col gap-3 w-full">
                    <h2 className="text-[var(--text)] text-[24px] font-bold">You might also like</h2>
                    <Slider itemsVisible={6}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product}/>
                        ))}
                    </Slider>
                </div>
            ) : (
                <div className="flex flex-col gap-3 w-full">
                    <h2 className="text-[var(--text)] text-[24px] font-bold">Complete the look</h2>
                    <Slider itemsVisible={6}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product}/>
                        ))}
                    </Slider>
                </div>
            )}
        </div>
    )
}