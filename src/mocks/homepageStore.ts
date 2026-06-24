import {HomePageData} from "@/types/homepage";
import getProductsByIds from "@/actions/products/getRandomProduts";
import {Gender} from "@/store/useGenderStore";

export async function getHomePageStore(gender: Gender): Promise<HomePageData> {
    const [adidasProducts, calvinKleinProducts, nikeProducts, newInProducts] = await Promise.all([
        getProductsByIds({gender, brandId: "8c90f9f5-47ab-4f51-a298-ea23bee3a1bd"}),
        getProductsByIds({gender, brandId: "942d25d3-b736-4d16-bf8e-de94c070de19"}),
        getProductsByIds({gender, brandId: "727c98c9-4ab9-41db-9a97-27706ce501a5"}),
        getProductsByIds({gender, limit: 12})
    ]);

    return {
        heroBanner: {
            title: "10% extra off",
            description: "Iconic brands, limited time, unbeatable deals",
            buttonText: "SUMMER",
            buttonUrlTemplate: "/collections/everything-summer",
            imageUrl: "/banners/hero-banner-v2.jpg",
        },

        specialOffers: [
            {
                id: "offer-1",
                imageUrl: `/banners/spec-offer/${gender === "women" ? "women/spec-offer-women-1.png" : "men/spec-offer-men-1.png"}`,
                title: "10% extra off. Code O-DEAL.",
                dealEnd: new Date(Date.now() + 7 * 60 * 60 * 1000 + 21 * 60 * 1000),
            },
            {
                id: "offer-2",
                imageUrl: `/banners/spec-offer/${gender === "women" ? "women/spec-offer-women-2.png" : "men/spec-offer-men-2.png"}`,
                title: "15% extra off. Code SUMMER15.",
                dealEnd: new Date(Date.now() + 3 * 60 * 60 * 1000),
            },
            {
                id: "offer-3",
                imageUrl: `/banners/spec-offer/${gender === "women" ? "women/spec-offer-women-3.png" : "men/spec-offer-men-3.png"}`,
                title: "Free shipping over €50",
            },
        ],

        brandsSection: {
            bannerUrl: "/banners/nike-banner-v3.jpg",
            brandName: "Nike",
            brandSlug: "nike",
            ctaText: "up to 85% off",
            badges: ["sale", "new items"],
        },

        collectionSection: {
            bannerUrl: "/banners/collection-banner.webp",
            title: "Everything Summer",
            description: "From beach days to late sunset drinks — this is your go-to summer edit.",
            collectionLink: "everything-summer",
        },
        exploreBrands: [
            {
                id: "06b6975e-7550-48d6-8c3e-009a9dec1803",
                bannerUrl: "/brand-banners/new/guess-banner.webp",
                badges: ["New brand", "New items"],
                text: "up to 50% off",
                slug: "guess",
                brandType: "new",
            },
            {
                id: "060d6028-5c6f-44dc-9573-a4a639d3342c",
                bannerUrl: "/brand-banners/new/hugoboss-banner.jpeg",
                badges: ["New brand", "Sale"],
                text: "up to 50% off",
                slug: "hugo",
                brandType: "new",
            },
            {
                id: "ffae2ca4-5397-493d-9872-7bce09a4344a",
                bannerUrl: "/brand-banners/new/puma-banner.jpg",
                badges: ["New brand", "Sale"],
                text: "up to 60% off",
                slug: "puma",
                brandType: "new",
            },
            {
                id: "e04e42b8-df08-4704-b78f-0b66ef45b627",
                bannerUrl: "/brand-banners/new/vans-banner.webp",
                badges: ["New brand", "Sale"],
                text: "up to 65% off",
                slug: "vans",
                brandType: "new",
            },
            {
                id: "942d25d3-b736-4d16-bf8e-de94c070de19",
                bannerUrl: "/brand-banners/popular/ck-banner.jpg",
                badges: ["Sale", "New items"],
                text: "up to 30% off",
                slug: "ck",
                brandType: "popular",
            },
            {
                id: "df871dae-5343-4edc-a31b-959d0949520a",
                bannerUrl: "/brand-banners/popular/lacoste-banner.jpg",
                badges: ["New Discount"],
                text: "up to 20% off",
                slug: "lacoste",
                brandType: "popular",
            },
            {
                id: "3f26ffc1-1f0f-4eb5-9c64-bc2cc4b4073a",
                bannerUrl: "/brand-banners/popular/levis-banner.avif",
                badges: ["New items"],
                text: "up to 50% off",
                slug: "levis",
                brandType: "popular",
            },
            {
                id: "d0837392-c3ec-4ce0-96c1-eab4d02a36b2",
                bannerUrl: "/brand-banners/popular/tommy-banner.jpg",
                badges: ["New items"],
                text: "up to 80% off",
                slug: "tommy",
                brandType: "popular",
            },
            {
                id: "8c90f9f5-47ab-4f51-a298-ea23bee3a1bd",
                bannerUrl: "/brand-banners/sport/adidas-banner.jpg",
                badges: ["Sale"],
                text: "up to 50% off",
                slug: "adidas",
                brandType: "sport",
            },
            {
                id: "17a346ce-f9b8-428b-9489-536da594a5bb",
                bannerUrl: "/brand-banners/sport/gstar-banner.webp",
                badges: ["New items"],
                text: "up to 50% off",
                slug: "gstar",
                brandType: "sport",
            },
            {
                id: "df0bf73b-d053-4db8-85b7-9ddb824ed8d6",
                bannerUrl: "/brand-banners/sport/nb-banner.webp",
                badges: ["New discount"],
                text: "up to 70% off",
                slug: "nb",
                brandType: "sport",
            },
            {
                id: "880cc287-f42a-4a10-83b1-ba1f79a5ab89",
                bannerUrl: "/brand-banners/sport/tnf-banner.jpeg",
                badges: ["New items"],
                text: "up to 90% off",
                slug: "tnf",
                brandType: "sport",
            },
        ],

        productsRows: [
            {
                id: "row-adidas",
                title: "New at Otrium: adidas – up to 55% off",
                description: "Check out the launch collection and shop your Three Stripes now.",
                products: adidasProducts,
            },
            {
                id: "New: Calvin Klein",
                title: "Up to 60% off the first drop",
                description: "Headliner-worthy looks have arrived. Time to shop your festival wardrobe.",
                products: calvinKleinProducts,
            },
            {
                id: "row-nike",
                title: "New drop: & Nike",
                description: "Trending new arrivals. Only while stocks last – up to 65% off.",
                products: nikeProducts,
            },
        ],
        newInProducts: newInProducts
    };
}