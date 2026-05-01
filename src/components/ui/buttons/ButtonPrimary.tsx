import cn from "classnames";
import React from "react";

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: "primary" | "secondary";
    className?: string;
    children: React.ReactNode;
}
export default function ButtonPrimary({ variant, className, children, ...rest }: ButtonPrimaryProps) {
    return(
        <button
            {...rest}
            className={cn(`${className} rounded-[32px] py-[8px] px-[32px] font-medium text-[16px] min-w-[260px] min-h-[50px] cursor-pointer`,{
            ["bg-black text-white"]: variant === "primary",
            ["bg-white text-[var(--text)] border"]: variant === "secondary",
        })}>
            {children}
        </button>
    )
}