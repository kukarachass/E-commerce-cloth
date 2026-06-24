"use client"
import {useRouter} from "next/navigation";

export default function ViewAllLink({path}: { path: string }) {
    const router = useRouter();

    return (
        <span className="text-[var(--text)] font-[600] leading-[150%] underline cursor-pointer" onClick={() => router.replace(path)}>View all</span>
    )
}