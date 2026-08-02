import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "@/app/(admin)/admin/_lib/cn";

export type ButtonVariant =
    | "primary"
    | "accent"
    | "outline"
    | "ghost"
    | "danger"
    | "soft";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANTS: Record<ButtonVariant, string> = {
    primary:
        "bg-ink-panel text-white hover:bg-ink shadow-card active:translate-y-px",
    accent:
        "bg-accent text-white hover:bg-accent-deep shadow-card active:translate-y-px",
    outline:
        "bg-card text-ink border border-line-strong hover:border-ink/25 hover:bg-sunk",
    ghost: "text-ink-soft hover:bg-sunk hover:text-ink",
    danger:
        "bg-card text-critical border border-critical/25 hover:bg-critical-soft",
    soft: "bg-sunk text-ink hover:bg-line-strong",
};

const SIZES: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-sm gap-2",
    icon: "h-10 w-10 justify-center",
};

export function buttonStyles({
    variant = "primary",
    size = "md",
    className,
}: {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
} = {}) {
    return cn(
        "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap",
        "transition-[background-color,color,border-color,transform,box-shadow] duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:pointer-events-none disabled:opacity-45",
        VARIANTS[variant],
        SIZES[size],
        className,
    );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

export default function Button({
    variant,
    size,
    className,
    type = "button",
    ...rest
}: ButtonProps) {
    return (
        <button
            type={type}
            className={buttonStyles({ variant, size, className })}
            {...rest}
        />
    );
}

export function LinkButton({
    href,
    variant,
    size,
    className,
    children,
    prefetch,
    target,
}: {
    href: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    children: ReactNode;
    prefetch?: boolean;
    target?: string;
}) {
    return (
        <Link
            href={href}
            prefetch={prefetch}
            target={target}
            className={buttonStyles({ variant, size, className })}
        >
            {children}
        </Link>
    );
}
