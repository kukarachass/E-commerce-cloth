import ViewAllLink from "@/components/ui/ViewAllLink";
import {ProductWithDetails} from "@/types/product-details";
import ProductCard from "@/components/product/ProductCard";
import Slider from "@/components/Slider/Slider";

interface NewInProps {
    products: ProductWithDetails[];
}
export default function NewIn({ products }: NewInProps ){
    return(
        <div className="flex flex-row items-center w-full gap-8 py-[64px]">
            <div className="flex flex-col gap-2 text-[var(--text)] shrink-0">
                <span className="font-bold text-[24px] leading-[125%]">New In</span>
                <span className="text-[16px] leading-[150%]">The latest (and greatest) styles</span>
                <ViewAllLink path={"new-items"}/>
            </div>

            <div className="min-w-0 flex-1">
                <Slider itemsVisible={5} gap={24}>
                    {products.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </Slider>
            </div>
        </div>
    )
}