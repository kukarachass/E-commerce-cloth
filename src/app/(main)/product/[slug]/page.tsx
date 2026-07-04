import ProductImageGallery from "@/components/product/ProductImageGallery"
import Breadcrumb from "@/components/ui/Breadcrumb"
import ProductInfo from "@/components/product/ProductInfo"
import ProductsRelated from "@/components/product/ProductsRelated"
import { getProduct } from "@/actions/products/get-product"
import { notFound } from "next/navigation"
import getCompleteTheLook from "@/actions/category/completeTheLook"

interface Props {
    params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params
    const product = await getProduct({ slug })
    if (!product) notFound()
    const { gender, categoryId } = product

    const completeTheLookProducts = await getCompleteTheLook({ gender, categoryId })

    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 pb-10">
            <div className="flex flex-col">
                <div className="py-3 lg:py-4">
                    <Breadcrumb />
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-8 lg:pb-10">
                    <div className="w-full lg:w-[800px] shrink-0">
                        <ProductImageGallery alt={product.name} images={product.images} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <ProductInfo product={product} />
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <ProductsRelated type="complete-look" currentId={product.id} products={completeTheLookProducts} />
                </div>
            </div>
        </div>
    )
}