import {productsArray} from "@/mocks/catalogStore";
import {ProductWithDetails} from "@/types/product-details";
import {IBrand} from "@/types/IBrand";

// если у тебя уже есть отдельный тип Product (например, для size-системы) —
// замени эту строку на импорт из него

export type HeroBannerData = {
    title: string;
    description: string;
    buttonText: string;
    buttonUrlTemplate: string; // путь БЕЗ префикса гендера, собирается в компоненте
    imageUrl: string;
};

export type SpecialOfferData = {
    id: string;
    imageUrl: string;
    title: string;
    dealEnd?: Date; // нет значения — таймер не рендерится
};

export type BrandsSectionData = {
    bannerUrl: string;
    brandSlug: string;
    brandName: string;
    ctaText: string;
    badges: string[];
};

export type brandTypes = "new" | "popular" | "sport";

// не отдельный тип — просто IBrand + одно UI-поле
export type BrandWithType = {
    brand: IBrand;
    brandType: brandTypes;
};

export type CollectionSectionData = {
    bannerUrl: string;
    title: string;
    description: string;
    collectionLink: string;
};

export type ProductsRowData = {
    id: string;
    title: string;
    description: string;
    products: ProductWithDetails[];
};

export type HomePageData = {
    heroBanner: HeroBannerData;
    specialOffers: SpecialOfferData[];
    brandsSection: BrandsSectionData;
    collectionSection: CollectionSectionData;
    productsRows: ProductsRowData[];
    newInProducts: ProductWithDetails[];
    exploreBrands: BrandWithType[];
};