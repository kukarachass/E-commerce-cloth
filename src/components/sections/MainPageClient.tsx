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
export default function MainPageClient({ homePageData, gender }: MainPageClientProps) {
    const {specialOffers, collectionSection, brandsSection, productsRows, heroBanner, newInProducts} = homePageData;

    return (
        <Container>
            <div className="pb-6">
                <HeroBanner
                    buttonText={heroBanner.buttonText}
                    buttonUrl={`/${gender}${heroBanner.buttonUrlTemplate}`}
                    imageUrl={heroBanner.imageUrl}
                    title={heroBanner.title}
                    description={heroBanner.description}
                />
            </div>

            <div className="pb-8">
                <PopularCategories gender={gender}/>
            </div>

            <div className="flex flex-row gap-6">
                {specialOffers.map((offer) => (
                    <SpecialOfferBlock offer={offer} key={offer.id}/>
                ))}

            </div>
            <NewIn products={newInProducts}/>

            <BrandsSection gender={gender} brandData={brandsSection}/>

            <div className="flex flex-col gap-6 pb-8">
                <div className="flex flex-col gap-4">
                    <h1 className="text-[var(--text)] text-[24px] font-bold leading-[125%]">Explore more</h1>
                </div>
                <BrandsSwitcher brands={homePageData.exploreBrands}/>
            </div>

            <CollectionSection
                gender={gender}
                bannerUrl={collectionSection.bannerUrl}
                description={collectionSection.description}
                title={collectionSection.title}
                collectionLink={collectionSection.collectionLink}
            />

            {productsRows.map(row => (
                <ProductsRow
                    key={row.id}
                    products={row.products}
                    title={row.title}
                    description={row.description}
                />
            ))}
        </Container>
    )
}