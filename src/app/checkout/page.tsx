import CheckoutStep1 from "@/components/checkout/CheckoutStep1";
import CheckoutStep2 from "@/components/checkout/CheckoutStep2";
import CheckoutStep3 from "@/components/checkout/CheckoutStep3";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";

interface Props {
    searchParams: Promise<{ step?: string }>
}

export default async function CheckoutPage({ searchParams }: Props) {
    const { step: stepParam } = await searchParams
    const step = Number(stepParam) || 1

    return (
        <div>
            <CheckoutStepper step={step}/>
            <div>
                {step === 1 && <CheckoutStep1 />}
                {step === 2 && <CheckoutStep2 />}
                {/*{step === 3 && <CheckoutStep3 />}*/}
            </div>
        </div>
    )
}