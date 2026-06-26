import Container from "@/components/layout/Сontainer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Image from "next/image";
import AddToFavButton from "@/components/favourites/AddToFavButton";
import InfoButton from "@/components/brand-page/InfoButton";
import {getProducts} from "@/actions/products/get-products";
import CatalogContainer from "@/components/catalog/CatalogContainer";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import {getCategoriesByProductIds} from "@/actions/category/categories";
import {getBrand, getBrands} from "@/actions/filters/brands/brands";
import {getSizes} from "@/actions/filters/sizes/sizes";
import {getPrice} from "@/actions/filters/price/price";
import {getColors} from "@/actions/filters/color/color";
import {getPatterns} from "@/actions/filters/pattern/pattern";
import {getStyles} from "@/actions/filters/style/style";
import {getDiscounts} from "@/actions/filters/discount/dicount";
import {Gender} from "@/hooks/useGender";

interface Props {
    params: Promise<{ gender: Gender; slug: string }>
    searchParams: Promise<{
        subcategory?: string | string[]
        color?: string
        pattern?: string
        style?: string
        minPrice?: string
        maxPrice?: string
        discount?: string
        sort?: string
    }>
}

export default async function BrandPage({params, searchParams}: Props) {
    const {slug, gender} = await params
    const filters = await searchParams
    const brand = await getBrand({slug})

    const products = await getProducts({
        gender,
        brand: [brand.slug],
        ...filters,
        subcategory: filters.subcategory
            ? Array.isArray(filters.subcategory) ? filters.subcategory : [filters.subcategory]
            : undefined,
    })

    const brandsProductIds = products.map(p => p.id)
    const categoryItems = await getCategoriesByProductIds(brandsProductIds)

    const [brands, sizes, price, colors, patterns, styles, discounts] = await Promise.all([
        getBrands({gender, productIds: brandsProductIds}),
        getSizes({gender, productIds: brandsProductIds}),
        getPrice({gender, productIds: brandsProductIds}),
        getColors({gender, productIds: brandsProductIds}),
        getPatterns({gender, productIds: brandsProductIds}),
        getStyles({gender, productIds: brandsProductIds}),
        getDiscounts({gender, productIds: brandsProductIds}),
    ])
    return (
        <Container>
            <Breadcrumb className="py-2"/>
            <div className="flex flex-col gap-6">
                <div className="relative w-full aspect-[16/5] overflow-hidden">
                    <Image src={brand.imageUrl} alt={brand.name} fill className="object-cover" />

                    {/* Градиент снизу — контент всегда читаем на любом фото */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                    {/* Контент */}
                    <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-4">

                        {/* Теги */}
                        <div className="flex flex-row flex-wrap justify-center gap-2">
                            {brand.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="border border-white/35 bg-white/12 backdrop-blur-md px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-white"
                                >
                    {tag}
                </span>
                            ))}
                        </div>

                        {/* Кнопки */}
                        <div className="flex flex-row items-center gap-3">
                            <AddToFavButton id={brand.id} className="cursor-pointer" type="brand" />
                            <InfoButton brand={brand} />
                        </div>
                    </div>
                </div>
                <CatalogLayout
                    brands={brands}
                    sizes={sizes}
                    price={price}
                    colors={colors}
                    patterns={patterns}
                    styles={styles}
                    discounts={discounts}
                    products={products}
                    category={""}
                    title={brand.name}
                    items={categoryItems ?? []}

                >
                    <CatalogContainer variant={'catalog'} products={products}/>
                </CatalogLayout>
            </div>
        </Container>
    )
}