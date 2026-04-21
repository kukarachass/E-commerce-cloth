import Link from "next/link";

export default function HeaderNav(){
    const navItems = [
        {
            text: "New Items",
            href: "/",
        },
        {
            text: "Brands",
            href: "/",
        },
        {
            text: "Clothing",
            href: "/",
        },
        {
            text: "Sportswear",
            href: "/",
        },
        {
            text: "Shoes",
            href: "/",
        },
        {
            text: "Accessories",
            href: "/",
        },
    ]
    return(
        <div className="flex justify-between items-center">
            <div className="flex gap-8">
                {navItems.map((item) => (
                    <Link
                        className="text-[var(--text)] font-medium text-[16px] hover:text-[var(--text-hover)] transition-all duration-300"
                        key={item.text}
                        href={item.href}
                    >
                        {item.text}
                    </Link>
                ))}
            </div>
        </div>
    )
}