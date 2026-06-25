"use client"

import { useRouter, usePathname } from "next/navigation";
import {Gender, GENDERS, useGender} from "@/hooks/useGender";

export default function GenderSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const currentGender = useGender();

    function switchGender(newGender: Gender) {
        const segments = pathname.split("/");
        segments[1] = newGender;
        router.push(segments.join("/"));
    }

    return (
        <div className="flex gap-2">
            {GENDERS.map(g => (
                <button
                    key={g}
                    onClick={() => switchGender(g)}
                    className={g === currentGender ? "font-bold" : "text-black/50"}
                >
                    {g}
                </button>
            ))}
        </div>
    );
}