"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCollections } from "@/hooks/useCollections";
import { useGender } from "@/hooks/useGender";

export default function HeaderNav() {
    const gender = useGender();
    const pathname = usePathname();
    const { data: collections = [] } = useCollections();

    const links = [
        { href: `/${gender}/new-items`,    label: "New items"   },
        { href: `/${gender}/brands`,        label: "Brands"      },
        ...collections.map((c) => ({
            href: `/${gender}/collections/${c.slug}`,
            label: c.title,
        })),
        { href: `/${gender}/clothing`,     label: "Clothing"    },
        { href: `/${gender}/sportswear`,   label: "Sportswear"  },
        { href: `/${gender}/shoes`,        label: "Shoes"       },
        { href: `/${gender}/accessories`,  label: "Accessories" },
    ];

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    return (
        <nav className="flex flex-row items-center gap-7">
            {links.map((link) => {
                const active = isActive(link.href);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={[
                            // base
                            "relative pb-[3px]",
                            "font-medium",
                            "transition-colors duration-200",
                            // underline via after pseudo-element
                            "after:absolute after:bottom-0 after:left-0 after:h-[1px]",
                            "after:transition-[width] after:duration-300 after:ease-out",
                            // state
                            active
                                ? "text-[var(--text)] after:w-full after:bg-[var(--text)]"
                                : "text-neutral-400 after:w-0 after:bg-[var(--text)] hover:text-[var(--text)] hover:after:w-full",
                        ].join(" ")}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}