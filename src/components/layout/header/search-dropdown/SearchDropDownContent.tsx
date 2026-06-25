import Link from "next/link";
import Image from "next/image";
import Search from "@/components/layout/header/BottomBar/Search";
import {useStickyStore} from "@/store/useStickyStore";
import Container from "@/components/layout/Сontainer";
import {useSearch} from "@/hooks/search/useSearch";
import {useSearchQueryStore} from "@/store/useSearchQueryStore";
import ActiveSearchDropwdown from "@/components/layout/header/search-dropdown/ActiveSearchDropdown";
import {useGenderStore} from "@/store/useGenderStore";
import {useSearchStore} from "@/store/useSearchOpen";
import {useGender} from "@/hooks/useGender";

const brands = [
    {href: "/popular-brands/adidas.svg"},
    {href: "/popular-brands/gucci.svg"},
    {href: "/popular-brands/levis.svg"},
    {href: "/popular-brands/nb.svg"},
    {href: "/popular-brands/nike.svg"},
    {href: "/popular-brands/puma.svg"},
]
const edits = [
    {name: "Tops & T-shirts", href: "/edits/t-shirts.png"},
    {name: "Jeans", href: "/edits/jeans.jpg"},
    {name: "Trainers", href: "/edits/trainers.png"},
    {name: "Dresses", href: "/edits/dresses.jpg"},
    {name: "Sportswear", href: "/edits/sportswear.png"},
    {name: "Bags", href: "/edits/bags.png"},
]

export default function SearchDropDownContent() {
    const isSticky = useStickyStore(state => state.isSticky)
    const setSearchOpen = useSearchStore(state => state.setSearchOpen);
    const query = useSearchQueryStore(state => state.query)
    const {data, isLoading, isError} = useSearch(query)
    const gender = useGender()


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
                                    <div key={brand.href} className="cursor-pointer shrink-0">
                                        <Image className="w-[185px] h-[100px]" src={brand.href} alt={brand.href}
                                               width={185}
                                               height={60}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 className="mb-2 text-[13px] font-semibold uppercase text-gray-400">Popular Edits</h1>

                            <div className="flex flex-row gap-4 pb-2 lg:pb-0 overflow-x-auto lg:overflow-x-visible">
                                {edits.map((edit) => (
                                    <div key={edit.href}
                                         className="flex flex-col gap-2 cursor-pointer shrink-0 w-[185px]">
                                        <Image src={edit.href} alt={edit.name} width={185} height={50}/>
                                        <span
                                            className="text-center text-[14px] text-[var(--text)] font-bold">{edit.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    )
}