"use client"
import {useRouter} from "next/navigation";

interface ViewAllLinkProps{
    path: string;
    className?: string;
}

export default function ViewAllLink({path, className }: ViewAllLinkProps) {
    const router = useRouter();

    return (
        <span className={`${className} text-[var(--text)] font-[600] leading-[150%] underline cursor-pointer`} onClick={() => router.replace(path)}>View all</span>
    )
}