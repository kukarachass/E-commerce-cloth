import { useGender } from "@/hooks/useGender"
import { useCollections } from "@/hooks/useCollections"

export interface NavLink {
    href: string
    label: string
}

export function useNavLinks(): NavLink[] {
    const gender = useGender()
    const { data: collections = [] } = useCollections()

    return [
        { href: `/${gender}/new-items`,   label: "New items"   },
        { href: `/${gender}/brands`,       label: "Brands"      },
        ...collections.map((c) => ({
            href: `/${gender}/collections/${c.slug}`,
            label: c.title,
        })),
        { href: `/${gender}/clothing`,    label: "Clothing"    },
        { href: `/${gender}/sportswear`,  label: "Sportswear"  },
        { href: `/${gender}/shoes`,       label: "Shoes"       },
        { href: `/${gender}/accessories`, label: "Accessories" },
    ]
}