import Container from "@/components/layout/Сontainer";
import CatalogContainer from "@/components/catalog/CatalogContainer";
import {productsArray} from "@/mocks/catalogStore";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Image from "next/image";
import AddToFavBrandButton from "@/components/product/AddToFavBrandButton";
import BrandInfoSvg from "@/components/ui/icons/BrandInfoSvg";
import InfoButton from "@/components/brand-page/InfoButton";

interface Props {
    params: Promise<{ gender: string; slug: string }>
}

const brand =
    {
        id: "1",
        name: "10DAYS",
        slug: "10days",
        items: [
            {
                name: "Clothing",
                subcategories: ["sperma", "penis", "zalupa"]
            },
            {
                name: "Sportswear",
                subcategories: ["sperma", "penis", "zalupa"]
            },
            {
                name: "Accessories",
                subcategories: ["sperma", "penis", "zalupa"]
            },
            {
                name: "Shoes",
                subcategories: ["sperma", "penis", "zalupa"]
            }
        ],
        tags: [
            {
                id: "1",
                name: "Sale",
                color: "#d0021b"
            },
            {
                id: "2",
                name: "New discount",
                color: "#d0021b"
            }
        ]
    }


export default async function BrandPage({params}: Props) {
    const {gender, slug} = await params

    return (
        <Container>
            <Breadcrumb className="py-2"/>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 relative w-full aspect-[16/5]">
                    <Image src={"/banners/model-banner.jpg"} alt={brand.name} fill/>
                    <div className="flex flex-col gap-6 items-center absolute left-0 right-0 top-[120px]">
                        <h1 className="font-[family-name:var(--font-cormorant)] [font-variant-numeric:lining-nums] tracking-wider text-[48px] text-white font-bold">{brand.name}</h1>
                        <div className="flex flex-row gap-6 items-center">
                            <AddToFavBrandButton className="cursor-pointer" type={"text"} brandId={brand.id}/>
                            <InfoButton brandName={brand.name}/>
                        </div>

                        <div className="flex flex-row gap-2">
                            {brand.tags.map(tag => (
                                <span key={tag.id} className={`text-[${tag.color}] text-[12px] font-bold bg-white px-2`}>{tag.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <CatalogLayout noTitle items={brand.items} title={brand.name}>
                    <CatalogContainer variant={'catalog'} products={productsArray}/>
                </CatalogLayout>
            </div>
        </Container>
    )
}