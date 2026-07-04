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
function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/&/g, " and ")           // & → and (до чистки спецсимволов)
        .normalize("NFKD")                // разбивает é → e + ́ (диакритика отдельно)
        .replace(/[\u0300-\u036f]/g, "")  // убирает диакритические знаки
        .replace(/[^a-z0-9\s-]/g, "")     // убирает всё, кроме букв/цифр/пробелов/дефисов
        .trim()
        .replace(/\s+/g, "-")             // пробелы → дефис
        .replace(/-+/g, "-")              // схлопывает повторяющиеся дефисы
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
                const link = `/${gender}/${slugify(data.name)}/${slugify(s.name)}`
                return (
                    <div onClick={() => handleClick(link)} key={s.id}>
                        <span className="text-[var(--text)] text-[16px]">{s.name}</span>
                    </div>
                )
            })}
        </div>
    )
}