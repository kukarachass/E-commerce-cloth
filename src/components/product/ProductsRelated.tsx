import Slider from "@/components/Slider/Slider";
import ProductCard from "@/components/product/ProductCard";
import { ProductWithDetails } from "@/types/product-details";

interface Props {
    products: ProductWithDetails[];
    currentId?: string | string[];
    type: "related" | "complete-look";
}

const TITLES = {
    related: "You might also like",
    "complete-look": "Complete the look",
} as const;

export default function ProductsRelated({ products, currentId, type }: Props) {
    const excludedIds = Array.isArray(currentId) ? currentId : currentId ? [currentId] : [];
    const filteredProducts = products.filter((p) => !excludedIds.includes(p.id));

    return (
        <div className="flex flex-col max-w-[1200px]">
            <div className="flex flex-col gap-3 w-full">
                <h2 className="text-[var(--text)] text-[20px] sm:text-[24px] font-bold">
                    {TITLES[type]}
                </h2>
                <Slider itemsVisible={{ base: 2, sm: 4, md: 5, lg: 6 }}>
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </Slider>
            </div>
        </div>
    );
}