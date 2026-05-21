"use client"

import {useGenderStore} from "@/store/useGenderStore";
import Container from "@/components/layout/Сontainer";
import HeroBanner from "@/components/sections/hero-banner/HeroBanner";
import PopularCategories from "@/components/sections/PopularCategories";
import SpecialOffers from "@/components/sections/special-offers/SpecialOffers";
import NewIn from "@/components/sections/new-in/NewIn";
import BrandsSection from "@/components/sections/BrandsSection";
import ExploreBrands from "@/components/sections/brands-explore/ExploreBrands";
import CollectionSection from "@/components/sections/collection-section/CollectionSection";
import ProductsRow from "@/components/sections/ProductsRow";
import {productsArray} from "@/mocks/catalogStore";

export default function MainPageClient() {
    const gender = useGenderStore(s => s.gender)

    return (
        <Container>
            <div className="pb-6">
                <HeroBanner
                    buttonText={"O-Deal"}
                    buttonUrl={`/${gender}/collections/o-deals`}
                    imageUrl={"/banners/hero-banner-w.jpg"}
                    title="10% extra off"
                    description="Iconic brands, limited time, unbeatable deals"
                />
            </div>
            <div className="pb-8">
                <PopularCategories/>
            </div>

            <SpecialOffers/>
            <NewIn/>

            <BrandsSection/>

            <div className="pb-8">
                <ExploreBrands/>
            </div>

            <CollectionSection
                bannerUrl={"/banners/collection-banner.webp"}
                description={"From beach days to late sunset drinks — this is your go-to summer edit."}
                title={"Everything Summer"}
                collectionLink={"everything-summer"}
            />

            <ProductsRow
                products={productsArray}
                title={"New at Otrium: adidas – up to 55% off"}
                description={"Check out the launch collection and shop your Three Stripes now."}
            />
            <ProductsRow
                products={productsArray}
                title={"Festival fits: up to 75% off"}
                description={"Headliner-worthy looks have arrived. Time to shop your festival wardrobe."}
            />
            <ProductsRow
                products={productsArray}
                title="Denim Deals: all under £47"
                description="Legendary denim brands at unbeatable prices. Your perfect pair is waiting."
            />
            <ProductsRow
                products={productsArray}
                title={"The perfect pants – up to 75% off"}
                description="From everyday staples to iconic statements, elevate every outfit with our trouser collection."

            />

        </Container>
    )
}