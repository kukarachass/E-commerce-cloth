import Breadcrumb from "@/components/ui/Breadcrumb"
import CollectionBanner from "@/components/collections/CollectionBanner"
import FilterBar from "@/components/catalog/FilterBar"
import CatalogContainer from "@/components/catalog/CatalogContainer"
import Container from "@/components/layout/Сontainer"
import {getCollection} from "@/actions/collection/collection"
import {getProducts} from "@/actions/products/get-products"
import {getBrands} from "@/actions/filters/brands/brands";
import {getSizes} from "@/actions/filters/sizes/sizes";
import {getPrice} from "@/actions/filters/price/price";
import {getColors} from "@/actions/filters/color/color";
import {getPatterns} from "@/actions/filters/pattern/pattern";
import {getStyles} from "@/actions/filters/style/style";
import {getDiscounts} from "@/actions/filters/discount/dicount";
import {Gender} from "@/hooks/useGender";

interface Props {
    params: Promise<{ gender: Gender; collection: string }>
    searchParams: Promise<{
        brand?: string | string[]
        color?: string
        pattern?: string
        style?: string
        minPrice?: string
        maxPrice?: string
        discount?: string
        sort?: string
    }>
}

export default async function CollectionPage({params, searchParams}: Props) {
    const {gender, collection: collectionSlug} = await params
    const filters = await searchParams

    const collectionData = await getCollection({ slug: collectionSlug, gender })
    const collectionProductIds = (collectionData?.products ?? []).map(p => p.productId)


    const [products, brands, sizes, price, colors, patterns, styles, discounts] = await Promise.all([
        getProducts({ gender, category: "", productIds: collectionProductIds, ...filters,
            brand: filters.brand ? Array.isArray(filters.brand) ? filters.brand : [filters.brand] : undefined }),
        getBrands({ gender, productIds: collectionProductIds }),
        getSizes({ gender, productIds: collectionProductIds }),
        getPrice({ gender, productIds: collectionProductIds }),
        getColors({ gender, productIds: collectionProductIds }),
        getPatterns({ gender, productIds: collectionProductIds }),
        getStyles({ gender, productIds: collectionProductIds }),
        getDiscounts({ gender, productIds: collectionProductIds }),
    ])

    return (
        <Container>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Breadcrumb className="py-2"/>
                        <CollectionBanner
                            title={collectionData?.title ?? "no title"}
                            description={collectionData?.description ?? "no desc"}
                        />
                    </div>
                    <div className="z-20">
                        <FilterBar
                            brands={brands}
                            sizes={sizes}
                            price={price}
                            colors={colors}
                            patterns={patterns}
                            styles={styles}
                            discounts={discounts}
                            category=""
                        />
                    </div>
                </div>
                <CatalogContainer variant="collection" products={products}/>
            </div>
        </Container>
    )
}