"use client";

import CartTitle from "@/components/cart/ui/CartTitle";
import InfoSvg from "@/components/ui/icons/InfoSvg";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import SummaryBlock from "@/components/cart/ui/SummaryBlock/SummaryBlock";
import CartItem from "@/components/cart/CartItem";
import FreeShippingProgress from "@/components/cart/ui/FreeShippingProgressBar";
import {useRouter} from "next/navigation";

interface Props {
    cartItems: any[]
}

export default function Cart({ cartItems }: Props){
    const router = useRouter();
    return(
        <div className="max-w-[1200px] py-4">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 items-center">
                    <CartTitle/>
                    <div className="flex flex-row items-center gap-2 rounded-[8px] p-3 bg-[#f9f9f9] w-fit">
                        <InfoSvg/>
                        <span className="text-[var(--text)] font-bold text-[14px] leading-[143%]">Products in your shopping cart are not reserved</span>
                    </div>
                    <FreeShippingProgress currentAmount={200} threshold={500}/>

                    <div className="flex flex-row gap-6">
                        <ButtonPrimary variant={"secondary"}>
                            Continue shopping
                        </ButtonPrimary>
                        <ButtonPrimary onClick={() => router.push("/checkout?step=1")} variant={"primary"}>
                            Continue to checkout
                        </ButtonPrimary>
                    </div>
                </div>
                <div className="flex mx-auto flex-row gap-6 relative w-full justify-center">
                    <div className="flex flex-col gap-4 flex-1 max-w-[600px]">
                        {cartItems.map((item) => (
                            <CartItem key={item.id} cartItem={item} />
                        ))}
                    </div>
                    <SummaryBlock/>
                </div>
            </div>
        </div>
    )
}
