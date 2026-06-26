import ProductImageGallery from "@/components/product/ProductImageGallery";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductInfo from "@/components/product/ProductInfo";
import ProductsRelated from "@/components/product/ProductsRelated";
import {productsArray} from "@/mocks/catalogStore";
import {getProduct} from "@/actions/products/get-product";
import {notFound} from "next/navigation";
import getCompleteTheLook from "@/actions/category/completeTheLook";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({params}: Props) {
    const { slug } = await params;
    const product = await getProduct({ slug });
    if (!product) notFound()
    const { gender, categoryId } = product;

    const completeTheLookProducts = await getCompleteTheLook({ gender, categoryId });

    return (
        <div className="max-w-[1200px] mx-auto pb-10">
            {product.gender}
            <div className="flex flex-col">
                <div className="py-4">
                    <Breadcrumb/>
                </div>
                <div className="flex flex-row gap-8 pb-10">
                    <div className="w-[800px]">
                        <ProductImageGallery alt={"name"} images={product.images}/>
                    </div>
                    <div className="flex-1">
                        <ProductInfo product={product}/>
                    </div>
                </div>
                <div className="flex flex-col gap-8">
                    {/*<ProductsRelated type={"related"} currentId={product.id} products={productsArray}/>*/}
                    <ProductsRelated type={"complete-look"} currentId={product.id} products={completeTheLookProducts}/>
                </div>

            </div>
        </div>
    )
}