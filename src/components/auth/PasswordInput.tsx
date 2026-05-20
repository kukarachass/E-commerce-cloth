"use client"

import React, { useState } from "react";

const PasswordInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <input
                ref={ref}
                {...props}
                type={show ? "text" : "password"}
                className="w-full rounded-[10px] border border-gray-300 px-4 py-2 pr-11 text-sm
                   focus:outline-none"
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="transition-all duration-300 absolute inset-y-0 right-3 flex items-center text-gray-400
                   hover:text-gray-600"
            >
                {show ? (
                    /* eye-off */
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M3 3l18 18M10.58 10.58a3 3 0 004.24 4.24"
                        />
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M9.88 5.08A10.94 10.94 0 0112 5c5.52 0 10 7 10 7a19.77 19.77 0 01-4.29 4.86"
                        />
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M6.61 6.61C3.18 9.06 2 12 2 12s4.48 7 10 7a10.9 10.9 0 004.28-.88"
                        />
                    </svg>
                ) : (
                    /* eye */
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                        />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                )}
            </button>
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;