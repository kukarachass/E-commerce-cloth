import ProductImageGallery from "@/components/product/ProductImageGallery";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductInfo from "@/components/product/ProductInfo";
import ProductsRelated from "@/components/product/ProductsRelated";
import {productsArray} from "@/mocks/catalogStore";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({params}: Props) {
    const {id} = await params;
    // логика получения продукта

    const product = {
        id: "1",
        brand: "Gucci",
        imgUrl: ["/product.webp", "/product2.webp", "/product3.webp", "product4.webp"],
        name: "Dolce Kabana",
        description: "Ahuenno super zaebis",
        price: 120,
        sizes: ["L", "M", "S", "XS", "XXS",],

        descriptionFull: "Placing A Playful Twist On Classic Gingham, Tammy Features A Bold, Scaled Up Check On Tactile Linton Tweed And Is Finished With A Stylish Raw Edge. This A-Line Skirt With Front Patch Pockets Looks Effortless Styled With A Tucked In Tee Or Camisole And A Simple Pair Of Sandals.&Nbsp;",
        material: "Cotton Mix",
        careInstructions: "Please Follow The Care Instructions On The Care Label"
    }
    return (
        <div className="max-w-[1200px] mx-auto pb-10">
            <div className="flex flex-col">
                <div className="py-4">
                    <Breadcrumb/>
                </div>
                <div className="flex flex-row gap-8 pb-10">
                    <div className="w-[800px]">
                        <ProductImageGallery alt={"name"}
                                             images={["/product/product1.webp", "/product/product2.webp", "/product/product3.webp", "/product/product4.webp", "/product/product5.webp"]}/>
                    </div>
                    <div className="flex-1">
                        <ProductInfo product={product}/>
                    </div>
                </div>
                <div className="flex flex-col gap-8">
                    <ProductsRelated type={"related"} currentId={product.id} products={productsArray}/>
                    <ProductsRelated type={"complete-look"} currentId={product.id} products={productsArray}/>
                </div>

            </div>
        </div>
    )
}