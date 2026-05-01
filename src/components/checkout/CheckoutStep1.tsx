import ContactInformation from "@/components/checkout/ContactInfromation";
import CheckoutSummaryBlock from "@/components/checkout/SummaryBlock/CheckoutSummaryBlock";

export default function CheckoutStep1() {
    return(
        <div className="flex flex-row gap-8 py-10">
            <ContactInformation/>
            <CheckoutSummaryBlock/>
        </div>
    )
}