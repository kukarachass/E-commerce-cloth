"use client";
import {useState} from "react";
import cn from "classnames";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";

export default function PromoCodeInput() {
    const [promoCode, setPromoCode] = useState<string>("");
    const disabled = !promoCode || promoCode.length === 0;

    return (
        <div className="relative flex flex-row items-center gap-2">
            <input
                onChange={(e) => setPromoCode(e.target.value)}
                className={cn("py-2 max-h-[40px] px-4 w-full text-[16px] border border-[#ccc] rounded-[10px]", {
                    ["text-[#999]"]: disabled,
                    ["text-[var(--text)]"]: !disabled,
                })}
                placeholder="e.g. HNOQW12"
                type="text"
            />
            <span className="absolute left-3 bottom-9 bg-white px-1 rounded text-[13px] text-[var(--text)] font-bold shadow-sm">
                promo code
            </span>
            <ButtonPrimary disabled={disabled} variant={disabled ? `secondary` : "primary"}>
                Apply
            </ButtonPrimary>
        </div>
    )
}