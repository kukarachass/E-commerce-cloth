import cn from "classnames"

interface Props {
    step: number
}

const steps = [
    { number: 1, label: "Information" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Confirmation" },
]

export default function CheckoutStepper({ step }: Props) {
    return (
        <div className="flex flex-col items-center gap-6">
            <h1 className="text-[clamp(40px,6vw,48px)] font-bold">Checkout</h1>

            <div className="flex items-center">
                {steps.map((s, index) => (
                    <div key={s.number} className="flex items-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className={cn(
                                "w-[32px] h-[32px] rounded-full flex items-center justify-center text-[16px] font-medium border-2 transition-all",
                                {
                                    "bg-black text-white border-black": step === s.number,
                                    "bg-white text-gray-300 border-gray-200": step !== s.number,
                                }
                            )}>
                                {s.number}
                            </div>
                            <span className={cn("text-[14px] font-medium", {
                                "text-black": step === s.number,
                                "text-gray-300": step !== s.number,
                            })}>
                                {s.label}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <div className="w-[80px] h-[1px] bg-gray-200 mb-6 mx-1" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}