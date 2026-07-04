import Container from "@/components/layout/Сontainer";
import HeroBanner from "@/components/sections/hero-banner/HeroBanner";
import PopularCategories from "@/components/sections/PopularCategories";
import NewIn from "@/components/sections/new-in/NewIn";
import BrandsSection from "@/components/sections/BrandsSection";
import CollectionSection from "@/components/sections/collection-section/CollectionSection";
import ProductsRow from "@/components/sections/ProductsRow";
import {HomePageData} from "@/types/homepage";
import SpecialOfferBlock from "@/components/sections/special-offers/SpecialOfferBlock";
import BrandsSwitcher from "@/components/sections/brands-explore/BrandsSwitcher";
import {Gender} from "@/hooks/useGender";

interface MainPageClientProps {
    homePageData: HomePageData;
    gender: Gender;
}

// async не нужен — данные уже зарезолвлены в page.tsx и приходят готовым пропом,
// внутри компонента никакого await нет
export default function MainPageClient({homePageData, gender}: MainPageClientProps) {
    const {specialOffers, collectionSection, brandsSection, productsRows, heroBanner, newInProducts} = homePageData;

    return (
        <Container>
            <div className="">
                <HeroBanner
                    buttonText={heroBanner.buttonText}
                    buttonUrl={`/${gender}${heroBanner.buttonUrlTemplate}`}
                    imageUrl={heroBanner.imageUrl}
                    title={heroBanner.title}
                    description={heroBanner.description}
                />
            </div>

            <div className="py-8 xl:py-10">
                <PopularCategories gender={gender}/>
            </div>
            <div className="px-4 xl:px-0">
                <div className="flex flex-row justify-between gap-2 lg:gap-6 py-8 xl:py-10 overflow-x-auto">
                    {specialOffers.map((offer) => (
                        <SpecialOfferBlock key={offer.id} offer={offer}/>
                    ))}
                </div>
            </div>


            <div className="px-4 xl:px-0 py-8 xl:py-10 ">
                <NewIn products={newInProducts}/>
            </div>

            <div className="px-4 xl:px-0">
                <BrandsSection gender={gender} brandData={brandsSection}/>
            </div>
            <div className="px-4 xl:px-0">
                <BrandsSwitcher brands={homePageData.exploreBrands}/>
            </div>

            <CollectionSection
                gender={gender}
                bannerUrl={collectionSection.bannerUrl}
                description={collectionSection.description}
                title={collectionSection.title}
                collectionLink={collectionSection.collectionLink}
            />

            <div className="px-4 xl:px-0">
                {productsRows.map(row => (
                    <ProductsRow
                        key={row.id}
                        products={row.products}
                        title={row.title}
                        description={row.description}
                    />
                ))}
            </div>
        </Container>
    )
}