import {catsSlug} from "@/components/layout/header/adaptive/mobile-menu/MobileMenu";
import {useGetCategoryWithSubs} from "@/hooks/category/useGetCategoryWithSubs";
import Arrow from "@/components/ui/icons/Arrow";
import CloseIconSvg from "@/components/ui/icons/CloseIconSvg";
import {useRouter} from "next/navigation";
import {useGender} from "@/hooks/useGender";

interface SubCatsNavPageProps{
    catSlug: catsSlug;
    setShowSubCats: (value: catsSlug | null) => void;
    onClose: () => void;
}

export default function SubCatsNavPage({ catSlug, setShowSubCats, onClose }: SubCatsNavPageProps) {
    const { data, isPending, isError } = useGetCategoryWithSubs({ slug: catSlug });
    const router = useRouter();
    const gender = useGender();
    if(isError) return <div>Error loading subcategories.</div>;
    if(isPending) return <div>Loading...</div>;

    const title = catSlug.replaceAll('-', ' ').toLowerCase().replace(/^./, c => c.toUpperCase());
    const handleClick = (link: string) => {
        onClose();
        router.push(link);
    }

    return(
        <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-row justify-between items-center">
                <div onClick={() => setShowSubCats(null)}>
                    <Arrow className="rotate-90 w-[14px] h-[14px]"/>
                </div>
                    <span className="text-[var(--text)] font-[600] text-[20px]">{title}</span>
                <CloseIconSvg onClick={onClose}/>
            </div>
            {data && data.subcategories.map(s => {
                const link = `/${gender}/${data.name.toLowerCase()}/${s.name.toLowerCase()}`
                return (
                    <div onClick={() => handleClick(link)} key={s.id}>
                        <span className="text-[var(--text)] text-[16px]">{s.name}</span>
                    </div>
                )
            })}
        </div>
    )
}