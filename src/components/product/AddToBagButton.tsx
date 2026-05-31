"use client";

import React, { useState } from "react";
import cn from "classnames";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";

interface AddToBagButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    variant?: "primary" | "secondary";
    className?: string;
    onAddToBag?: () => void;
}

function BagIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 6V5C6 3.67392 6.52678 2.40215 7.46447 1.46447C8.40215 0.526784 9.67392 0 11 0H13C14.3261 0 15.5979 0.526784 16.5355 1.46447C17.4732 2.40215 18 3.67392 18 5V6H21C21.2652 6 21.5196 6.10536 21.7071 6.29289C21.8946 6.48043 22 6.73478 22 7V21C22 21.5304 21.7893 22.0391 21.4142 22.4142C21.0391 22.7893 20.5304 23 20 23H4C3.46957 23 2.96086 22.7893 2.58579 22.4142C2.21071 22.0391 2 21.5304 2 21V7C2 6.73478 2.10536 6.48043 2.29289 6.29289C2.48043 6.10536 2.73478 6 3 6H6ZM6 8H4V21H20V8H18V10C18 10.2652 17.8946 10.5196 17.7071 10.7071C17.5196 10.8946 17.2652 11 17 11C16.7348 11 16.4804 10.8946 16.2929 10.7071C16.1054 10.5196 16 10.2652 16 10V8H8V10C8 10.2652 7.89464 10.5196 7.70711 10.7071C7.51957 10.8946 7.26522 11 7 11C6.73478 11 6.48043 10.8946 6.29289 10.7071C6.10536 10.5196 6 10.2652 6 10V8ZM8 6H16V5C16 4.20435 15.6839 3.44129 15.1213 2.87868C14.5587 2.31607 13.7956 2 13 2H11C10.2044 2 9.44129 2.31607 8.87868 2.87868C8.31607 3.44129 8 4.20435 8 5V6Z"
                fill="currentColor"
            />
        </svg>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                fill="currentColor"
            />
        </svg>
    );
}

export default function AddToBagButton({
                                           variant = "primary",
                                           className,
                                           onAddToBag,
                                           disabled,
                                           ...rest
                                       }: AddToBagButtonProps) {
    const [isAdded, setIsAdded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        if (isAnimating || isAdded) return;

        setIsAnimating(true);
        setIsAdded(true);
        onAddToBag?.();

        // Reset after animation
        setTimeout(() => {
            setIsAnimating(false);
        }, 600);

        // Reset to default state after delay (optional - remove if you want it to stay "Added")
        setTimeout(() => {
            setIsAdded(false);
        }, 2500);
    };

    return (
        <ButtonPrimary
            variant={"primary"}
            {...rest}
            disabled={disabled || isAnimating}
            onClick={handleClick}
            className={cn(
                "relative overflow-hidden", // ← добавь overflow-hidden
                "disabled:cursor-not-allowed",
                {
                    "bg-black text-white hover:bg-black/90": variant === "primary",
                    "bg-white text-[var(--text)] border hover:bg-gray-50": variant === "secondary",
                },
                className
            )}
        >
    <span
        className={cn(
            "flex items-center justify-center gap-2 transition-all duration-300 ease-out",
            isAdded
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
        )}
    >
        Add to Bag
    </span>

            <span
                className={cn(
                    "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ease-out",
                    isAdded
                        ? "opacity-100 translate-y-0"
                        : "opacity-100 translate-y-full"  // ← снизу приходит, не сверху
                )}
            >
        <span className="relative">
            <BagIcon className="w-5 h-5" />
            <span
                className={cn(
                    "absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 transition-all duration-300 delay-150",
                    isAdded ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
            >
                <CheckIcon className="w-2 h-2 text-white" />
            </span>
        </span>
        <span>Added to Bag</span>
    </span>
        </ButtonPrimary>
    );
}
