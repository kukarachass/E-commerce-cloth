import { useGender } from "@/hooks/useGender"
import { useCollections } from "@/hooks/useCollections"
import useGetParentCats from "@/hooks/category/useGetParentCats";

export interface NavLink {
    href: string
    label: string
    isMain?: boolean;
    slug?: string;
}

export function useNavLinks(): NavLink[] {
    const gender = useGender()
    const { data: collections = [] } = useCollections()
    const { data: parentCats = [] } = useGetParentCats()

    return [
        { href: `/${gender}/new-items`,   label: "New items"    },
        { href: `/${gender}/brands`,       label: "Brands"      },
        ...collections.map((c) => ({
            href: `/${gender}/collections/${c.slug}`,
            label: c.title,
        })),
        ...parentCats.map((c) => ({
            href: `/${gender}/${c.name.toLowerCase()}`,
            label: c.name,
            slug: c.slug,
            isMain: true,
        })),
    ]
}

// { href: `/${gender}/clothing`,    label: "Clothing",    isMain: true, slug: "clothing"           },
// { href: `/${gender}/sportswear`,  label: "Sportswear",  isMain: true, slug: "sportswear"         },
// { href: `/${gender}/shoes`,       label: "Shoes",       isMain: true, slug: "shoes"              },
// { href: `/${gender}/accessories`, label: "Accessories", isMain: true, slug: "accessories"        },