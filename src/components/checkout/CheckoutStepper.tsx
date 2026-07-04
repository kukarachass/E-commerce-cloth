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
        <div className="flex flex-col items-center gap-4 sm:gap-6">
            <h1 className="text-[clamp(28px,7vw,48px)] font-bold">Checkout</h1>

            <div className="flex items-center w-full max-w-[420px] sm:max-w-none sm:w-auto">
                {steps.map((s, index) => (
                    <div key={s.number} className="flex items-center flex-1 sm:flex-initial last:flex-none">
                        <div className="flex flex-col items-center gap-1.5 sm:gap-2 shrink-0">
                            <div className={cn(
                                "w-7 h-7 sm:w-[32px] sm:h-[32px] rounded-full flex items-center justify-center text-[13px] sm:text-[16px] font-medium border-2 transition-all",
                                {
                                    "bg-black text-white border-black": step === s.number,
                                    "bg-white text-gray-300 border-gray-200": step !== s.number,
                                }
                            )}>
                                {s.number}
                            </div>
                            <span className={cn("text-[11px] sm:text-[14px] font-medium whitespace-nowrap", {
                                "text-black": step === s.number,
                                "text-gray-300": step !== s.number,
                            })}>
                                {s.label}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <div className="flex-1 sm:flex-initial sm:w-[80px] h-[1px] bg-gray-200 mb-5 sm:mb-6 mx-1" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}