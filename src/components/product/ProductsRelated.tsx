import Slider from "@/components/Slider/Slider";
import ProductCard from "@/components/product/ProductCard";
import {IProduct} from "@/components/product/IProduct";

interface IProductsRelatedProps {
    products: IProduct[];
}

export default function ProductsRelated({ products }: IProductsRelatedProps) {
    return(
        <div className="flex flex-col max-w-[1200px]">
            <h2 className="text-[var(--text)] text-[24px] font-medium">You might also like</h2>
            <Slider>
                {products.map(product => (
                    <ProductCard key={product.id} product={product}/>
                ))}
            </Slider>
        </div>
    )
}