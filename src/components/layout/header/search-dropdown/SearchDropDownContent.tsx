import Link from "next/link";
import Image from "next/image";
import Search from "@/components/layout/header/BottomBar/Search";
import {useStickyStore} from "@/store/useStickyStore";
import Container from "@/components/layout/Сontainer";
import {useSearch} from "@/hooks/search/useSearch";
import {useSearchQueryStore} from "@/store/useSearchQueryStore";
import ActiveSearchDropwdown from "@/components/layout/header/search-dropdown/ActiveSearchDropdown";
import {useSearchStore} from "@/store/useSearchOpen";
import {useGender} from "@/hooks/useGender";
import {Gender} from "@/lib/isGender";


function getPopBrands(gender: Gender){
    return [
        {href: "/popular-brands/adidas.svg", url: `/${gender}/brands/adidas`},
        {href: "/popular-brands/cksvg.svg", url: `/${gender}/brands/calvin-klein`},
        {href: "/popular-brands/levis.svg", url: `/${gender}/brands/levis`},
        {href: "/popular-brands/nb.svg", url: `/${gender}/brands/new-balance`},
        {href: "/popular-brands/nike.svg", url: `/${gender}/brands/nike`},
        {href: "/popular-brands/puma.svg", url: `/${gender}/brands/puma`},
    ]
}

function getPopularCategories(gender: Gender) {
    const womenCat = [
        { id: "1", name: "Dresses", url: "/pop-cat/women/dress.jpg", href: `/women/clothing/dresses`},
        { id: "2", name: "Jeans", url: "/pop-cat/women/jeans.jpg", href: `/women/clothing/jeans`},
        { id: "3", name: "T-Shirts", url: "/pop-cat/women/tops.png", href: `/women/clothing/shirts-and-tops`},

        { id: "4", name: "Trainers", url: "/pop-cat/women/sneak.png", href: `/women/shoes/trainers`},
        { id: "5", name: "Bags", url: "/pop-cat/women/bags.png", href: `/women/accessories/bags`},
        { id: "6", name: "Sportswear", url: "/pop-cat/women/sports.png", href: `/women/sportswear`}
    ]

    const menCat = [
        { id: "1", name: "T-shirts", url: "/pop-cat/men/pop-cat-t-shirt.png", href: `/men/clothing/t-shirts-and-polos`},
        { id: "2", name: "Jeans", url: "/pop-cat/men/pop-cat-jeans.png", href: `/men/clothing/jeans`},
        { id: "3", name: "Trainers", url: "/pop-cat/men/pop-cat-trainers.png", href: `/men/shoes/trainers`},

        { id: "4", name: "Jackets", url: "/pop-cat/men/pop-cat-jackets.jpg", href: `/men/clothing/jackets`},
        { id: "5", name: "Shirts", url: "/pop-cat/men/pop-cat-shirts.png", href: `/men/clothing/shirts`},
        { id: "6", name: "Sports Clothing & Apparel", url: "/pop-cat/men/pop-cat-sports.png", href: `/men/sportswear`}
    ]

    return gender === "men" ? menCat : womenCat
}


export default function SearchDropDownContent() {
    const isSticky = useStickyStore(state => state.isSticky)
    const setSearchOpen = useSearchStore(state => state.setSearchOpen);
    const query = useSearchQueryStore(state => state.query)
    const {data, isLoading, isError} = useSearch(query)
    const gender = useGender()

    const categories = getPopularCategories(gender);
    const brands = getPopBrands(gender);


    if (isError) {
        return (
            <div>
                <p className="text-sm text-red-600">
                    Something went wrong, please try again.
                </p>
            </div>
        )
    }

    // LOADING (первый запрос, без placeholder-данных)

    const handleClose = () => {
        setSearchOpen(false);
    }


    return (
        <div className="bg-white w-full ">
            <Container>
                <div className={isSticky ? "py-5" : ""}>
                    {isSticky && <Search/>}
                </div>
                {query.length > 0 ? (
                    <ActiveSearchDropwdown data={data} query={query}/>
                ) : (
                    <div className="flex flex-col gap-6 py-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row items-center justify-between">
                                <h1 className="mb-2 text-[13px] font-semibold uppercase text-gray-400">Popular
                                    Brands</h1>
                                <Link
                                    className="mb-2 text-[13px] font-semibold uppercase text-gray-400 border-b"
                                    href={`/${gender}/brands`}
                                    onClick={() => handleClose()}
                                >
                                    View all
                                </Link>
                            </div>

                            <div className="flex flex-row gap-4 overflow-x-auto lg:overflow-x-visible">
                                {brands.map((brand) => (
                                    <Link onClick={() => setSearchOpen(false)} href={brand.url} key={brand.href} className="cursor-pointer shrink-0">
                                        <Image className="w-[185px] h-[100px]" src={brand.href} alt={brand.href}
                                               width={185}
                                               height={60}/>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 className="mb-2 text-[13px] font-semibold uppercase text-gray-400">Popular Categories</h1>

                            <div className="flex flex-row gap-4 pb-2 lg:pb-0 overflow-x-auto lg:overflow-x-visible">
                                {categories.map((cat) => (
                                    <Link onClick={() => setSearchOpen(false)} href={cat.href} key={cat.id}
                                         className="flex flex-col gap-2 cursor-pointer shrink-0 w-[185px]">
                                        <Image src={cat.url} alt={cat.name} width={185} height={50}/>
                                        <span
                                            className="text-center text-[14px] text-[var(--text)] font-bold">{cat.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    )
}