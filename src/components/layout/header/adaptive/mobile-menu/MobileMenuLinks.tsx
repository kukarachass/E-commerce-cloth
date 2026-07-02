import {useNavLinks} from "@/hooks/layout/useNavLinks";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Arrow from "@/components/ui/icons/Arrow";
import {catsSlug} from "@/components/layout/header/adaptive/mobile-menu/MobileMenu";

interface MobileMenuLinksProps {
    handleClose: () => void;
    setShowSubCats: (value: catsSlug) => void;
}

export default function MobileMenuLinks({handleClose, setShowSubCats}: MobileMenuLinksProps) {
    const links = useNavLinks()
    const pathname = usePathname()
    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/")

    const handleMainLinkClick = (slug: catsSlug) => {
        setShowSubCats(slug)
    }

    return (
        <nav className="flex flex-col overflow-y-auto flex-1 py-2">
            {links.map((link) => {
                const active = isActive(link.href)

                return link.isMain ? (
                    <div key={link.slug} className="flex flex-row justify-between pr-4 items-center">
                        <div
                            onClick={() => handleMainLinkClick(link.slug as catsSlug)}
                            className={[
                                "px-5 py-3.5 text-[15px] font-medium border-b border-gray-50 transition-colors",
                                active
                                    ? "text-black"
                                    : "text-[var(--text)] hover:text-neutral-500",
                            ].join(" ")}
                        >
                            {link.label}
                        </div>
                        <Arrow className={"-rotate-90"}/>
                    </div>
                ) : (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={handleClose}
                        className={[
                            "px-5 py-3.5 text-[15px] font-medium border-b border-gray-50 transition-colors",
                            active
                                ? "text-black"
                                : "text-[var(--text)] hover:text-neutral-500",
                        ].join(" ")}
                    >
                        {link.label}
                    </Link>
                )
            })}
        </nav>
    )
}