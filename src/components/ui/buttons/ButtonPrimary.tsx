import cn from "classnames";
import React from "react";

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: "primary" | "secondary";
    className?: string;
    children: React.ReactNode;
}

export default function ButtonPrimary({
                                          variant,
                                          className,
                                          children,
                                          ...rest
                                      }: ButtonPrimaryProps) {
    return (
        <button
            {...rest}
            className={cn(
                className,
                "transition-all duration-300 font-[600] rounded-[10px] text-[16px] py-2 px-4 cursor-pointer max-h-[40px] h-full",
                {
                    "bg-black text-white hover:bg-black/85": variant === "primary" && !rest.disabled,
                    "bg-black/40 text-white cursor-not-allowed": variant === "primary" && rest.disabled,

                    "bg-white text-[var(--text)] border border-gray-200 hover:bg-gray-100":
                        variant === "secondary" && !rest.disabled,
                }
            )}
        >
            {children}
        </button>
    );
}