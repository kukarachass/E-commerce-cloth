import Link from "next/link";
import {useGenderStore} from "@/store/useGenderStore";

export default function ViewAllLink({path}: { path: string }) {
    const gender = useGenderStore(s => s.gender)
    return (
        <Link className="text-[var(--text)] font-[600] leading-[150%] underline" href={`/${gender}/${path}`}>View all</Link>
    )
}