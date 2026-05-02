import CheckoutSummaryBlock from "@/components/checkout/SummaryBlock/CheckoutSummaryBlock";
import PaymentMethod from "@/components/checkout/step-2/PaymentMethod";

export default function CheckoutStep2() {
    return(
        <div className="flex flex-row gap-8 py-10 mx-auto justify-center">
            <PaymentMethod/>
            <CheckoutSummaryBlock href={"/success"}/>
        </div>
    )
}