import CheckoutStep1 from "@/components/checkout/CheckoutStep1";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";

export default async function CheckoutPage() {
    return (
        <div>
            <CheckoutStepper step={1}/>
            <div>
                <CheckoutStep1/>
            </div>
        </div>
    )
}