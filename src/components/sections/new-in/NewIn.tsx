import Slider from "@/components/Slider/Slider";
import ProductCard from "@/components/product/ProductCard";
import {productsArray} from "@/mocks/catalogStore";
import Link from "next/link";
import {useGenderStore} from "@/store/useGenderStore";
import ViewAllLink from "@/components/ui/ViewAllLink";

export default function NewIn(){
    return(
        <div className="flex flex-row items-center w-full gap-8 py-[64px]">
            <div className="flex flex-col gap-2 text-[var(--text)] shrink-0">
                <span className="font-bold text-[24px] leading-[125%]">New In</span>
                <span className="text-[16px] leading-[150%]">The latest (and greatest) styles</span>
                <ViewAllLink path={"new-items"}/>
            </div>

            <div className="min-w-0 flex-1">
                <Slider itemsVisible={5} gap={24}>
                    {productsArray.map(p => (
                        <ProductCard variant={"noButton"} key={p.id} product={p} />
                    ))}
                </Slider>
            </div>
        </div>
    )
}