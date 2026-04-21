import Image from "next/image";
import Link from "next/link";
import GenderSwitcher from "@/components/layout/header/GenderSwitcher";

export default function SearchDropdown() {

    const brands = [
        { href: "/popular-brands/adidas.svg"},
        { href: "/popular-brands/gucci.svg"},
        { href: "/popular-brands/levis.svg"},

        { href: "/popular-brands/nb.svg"},
        { href: "/popular-brands/nike.svg"},
        { href: "/popular-brands/puma.svg"},

    ]

    const edits = [
        { name: "Tops & T-shirts", href: "/edits/t-shirts.png"},
        { name: "Jeans", href: "/edits/jeans.jpg"},
        { name: "Trainers", href: "/edits/trainers.png"},

        { name: "Dresses", href: "/edits/dresses.jpg"},
        { name: "Sportswear", href: "/edits/sportswear.png"},
        { name: "Bags", href: "/edits/bags.png"},

    ]
    return (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto p-2">
            <GenderSwitcher className="lg:hidden flex w-full text-center mx-auto justify-center"/>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-[var(--text)] font-bold text-[clamp(20px,2vw,24px)] leading-[167%]">Popular brands</h1>
                    <Link href="/" className="border-b font-bold text-[16px]">View All</Link>
                </div>
                <div className="flex flex-row gap-4 overflow-x-auto lg:overflow-x-visible">
                    {brands.map((brand) => (
                        <div key={brand.href} className="cursor-pointer shrink-0">
                            <Image className="w-[185px] h-[100px]" src={brand.href} alt={brand.href} width={185} height={60}/>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="text-[var(--text)] font-bold text-[clamp(20px,2vw,24px)] leading-[167%]">Popular Edits</h1>
                <div className="flex flex-row gap-4 pb-2 lg:pb-0 overflow-x-auto lg:overflow-x-visible">
                    {edits.map((brand) => (
                        <div key={brand.href} className="flex flex-col gap-2 cursor-pointer shrink-0 w-[185px]">
                            <Image src={brand.href} alt={brand.href} width={185} height={50}/>
                            <span className="text-center text-[14px] text-[var(--text)] font-bold">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}