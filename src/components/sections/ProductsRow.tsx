import Slider from "@/components/Slider/Slider";
import {IProduct} from "@/components/product/IProduct";
import ProductCard from "@/components/product/ProductCard";

interface IProps {
    products: IProduct[];
    title: string;
    description: string;
}

export default function ProductsRow({ products, title, description }: IProps) {
    return(
        <div className="flex flex-col gap-4 w-full py-8">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col text-[var(--text)]">
                    <h1 className={"text-[24px] font-bold leading-[125%]"}>{title}</h1>
                    <span className="text-[18px]">{description}</span>
                </div>
            </div>
            {/*<Slider itemsVisible={6} gap={24}>*/}
            {/*    {products.map((product) => (*/}
            {/*        <ProductCard variant={"noButton"} product={product}/>*/}
            {/*    ))}*/}
            {/*</Slider>*/}
            /components/sections/ProductRow.tsx --- доделать
        </div>
    )
}