import cn from "@/app/(admin)/admin/_lib/cn";
import { initials } from "@/app/(admin)/admin/_lib/format";

/** Мягкие тона — цвет стабильно закреплён за именем, а не случайный */
const TINTS = [
    "bg-[#fbe6ec] text-[#b3234f]",
    "bg-[#e6ecfb] text-[#2f4bb3]",
    "bg-[#e4f2ea] text-[#1f7a54]",
    "bg-[#fbf0e0] text-[#95611a]",
    "bg-[#efe8fb] text-[#5b3ab3]",
    "bg-[#e3f1f5] text-[#1c6b80]",
];

function tintOf(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
    return TINTS[Math.abs(hash) % TINTS.length];
}

const SIZES = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
} as const;

export default function Avatar({
    name,
    email,
    src,
    size = "md",
    className,
}: {
    name?: string | null;
    email?: string | null;
    src?: string | null;
    size?: keyof typeof SIZES;
    className?: string;
}) {
    const seed = name || email || "guest";

    if (src) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt=""
                className={cn(
                    "shrink-0 rounded-full object-cover",
                    SIZES[size],
                    className,
                )}
            />
        );
    }

    return (
        <span
            className={cn(
                "grid shrink-0 place-items-center rounded-full font-semibold select-none",
                SIZES[size],
                tintOf(seed),
                className,
            )}
            aria-hidden
        >
            {initials(name ?? email ?? undefined, "G")}
        </span>
    );
}
