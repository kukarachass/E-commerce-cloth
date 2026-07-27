import {ReactNode} from "react";
import Link from "next/link";

export default function FilterTab({
                       href,
                       active,
                       children,
                   }: {
    href: string;
    active: boolean;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className={
                "px-3 py-1.5 rounded-md border " +
                (active ? "bg-black text-white border-black" : "border-gray-300")
            }
        >
            {children}
        </Link>
    );
}