import FloatingLabelInput from "@/components/ui/inputs/FloatingLabelInput"

export default function CardForm() {
    return (
        <div className="flex flex-col gap-5">
            <FloatingLabelInput label={"Card Number"} />
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <FloatingLabelInput className="w-full" label={"Expiry date"} />
                <FloatingLabelInput className="w-full" label={"CVC / CVV"} />
            </div>
            <FloatingLabelInput label={"Cardholder"} />
        </div>
    )
}