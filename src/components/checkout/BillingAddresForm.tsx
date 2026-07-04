import FloatingLabelInput from "@/components/ui/inputs/FloatingLabelInput"

export default function BillingAddresForm() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <FloatingLabelInput className="w-full" label="Street *" />
                <div className="flex flex-row gap-2 w-full">
                    <FloatingLabelInput label="Number *" />
                    <FloatingLabelInput label="House addition" />
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <FloatingLabelInput className="w-full" label="Postcode *" />
                <FloatingLabelInput className="w-full" label="City *" />
            </div>
            <FloatingLabelInput label="Country *" />
        </div>
    )
}