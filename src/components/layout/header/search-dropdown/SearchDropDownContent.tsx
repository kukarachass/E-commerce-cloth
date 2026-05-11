import Link from "next/link";
import Image from "next/image";
import Search from "@/components/layout/header/BottomBar/Search";
import {useStickyStore} from "@/store/useStickyStore";
import Container from "@/components/layout/Сontainer";

export default function SearchDropDownContent() {
    const isSticky = useStickyStore(state => state.isSticky)

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

    return (
        <div className="bg-white w-full ">
            <Container>
                <div className="flex flex-col gap-6 py-4">
                    {isSticky && (
                        <Search/>
                    )}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center justify-between">
                            <h1 className="text-[var(--text)] font-medium text-[clamp(20px,2vw,24px)]">Popular
                                Brands</h1>
                            <Link className="text-[var(--text)] text-[16px] font-bold border-b border-black" href="/">View
                                all</Link>
                        </div>

                        <div className="flex flex-row gap-4 overflow-x-auto lg:overflow-x-visible">
                            {brands.map((brand) => (
                                <div key={brand.href} className="cursor-pointer shrink-0">
                                    <Image className="w-[185px] h-[100px]" src={brand.href} alt={brand.href} width={185}
                                           height={60}/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-[var(--text)] font-medium text-[clamp(20px,2vw,24px)]">Popular Edits</h1>

                        <div className="flex flex-row gap-4 pb-2 lg:pb-0 overflow-x-auto lg:overflow-x-visible">
                            {edits.map((edit) => (
                                <div key={edit.href} className="flex flex-col gap-2 cursor-pointer shrink-0 w-[185px]">
                                    <Image src={edit.href} alt={edit.name} width={185} height={50}/>
                                    <span
                                        className="text-center text-[14px] text-[var(--text)] font-bold">{edit.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}