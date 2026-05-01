import CartTitle from "@/components/cart/ui/CartTitle";
import InfoSvg from "@/components/ui/icons/InfoSvg";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import SummaryBlock from "@/components/cart/ui/SummaryBlock/SummaryBlock";
import CartItem from "@/components/cart/CartItem";
import ProductsRelated from "@/components/product/ProductsRelated";
import FreeShippingProgress from "@/components/cart/ui/FreeShippingProgressBar";

interface Props {
    cartItems: any[]
}

export default function Cart({ cartItems }: Props){
    return(
        <div className="max-w-[1200px] mx-auto py-4">
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
                        <ButtonPrimary variant={"primary"}>
                            Continue to checkout
                        </ButtonPrimary>
                    </div>
                </div>
                <div className="flex flex-row gap-6 relative mx-auto w-full justify-center">
                    <div className="flex flex-col gap-4">
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
