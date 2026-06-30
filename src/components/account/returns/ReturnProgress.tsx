const STEPS = ["Select order", "Choose items", "Review"] as const

export default function ReturnProgress({ current }: { current: 1 | 2 | 3 }) {
    return (
        <div className="flex items-center gap-2 sm:gap-3">
            {STEPS.map((label, i) => {
                const step = i + 1
                const done = step < current
                const active = step === current
                return (
                    <div key={label} className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1.5 sm:gap-2.5">
                            <span className={`
                                flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                                text-[12px] font-medium transition-colors
                                ${active || done
                                ? "bg-neutral-900 text-white"
                                : "border border-neutral-300 text-neutral-400"
                            }
                            `}>
                                {done ? (
                                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                        <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : step}
                            </span>

                            {/* Мобилка: лейбл только у активного шага */}
                            <span className={`
                                text-[13px] transition-colors
                                ${active
                                ? "font-medium text-neutral-900"
                                : "hidden sm:inline text-neutral-400"
                            }
                            `}>
                                {label}
                            </span>
                        </div>

                        {step < STEPS.length && (
                            <span className="h-px w-4 sm:w-8 shrink-0 bg-neutral-200" />
                        )}
                    </div>
                )
            })}
        </div>
    )
}