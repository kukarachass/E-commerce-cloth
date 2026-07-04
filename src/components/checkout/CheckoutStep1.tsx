import ContactInformation from "@/components/checkout/ContactInfromation"
import CheckoutSummaryBlock from "@/components/checkout/SummaryBlock/CheckoutSummaryBlock"

export default function CheckoutStep1() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 py-6 sm:py-10 lg:justify-center">
            <ContactInformation />
            <CheckoutSummaryBlock />
        </div>
    )
}