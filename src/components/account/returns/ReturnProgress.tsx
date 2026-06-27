const STEPS = ["Select order", "Choose items", "Review"] as const

export default function ReturnProgress({ current }: { current: 1 | 2 | 3 }) {
    return (
        <div className="flex items-center gap-3">
            {STEPS.map((label, i) => {
                const step = i + 1
                const done = step < current
                const active = step === current
                return (
                    <div key={label} className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5">
                            <span
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-medium transition-colors ${
                                    active
                                        ? "bg-neutral-900 text-white"
                                        : done
                                            ? "bg-neutral-900 text-white"
                                            : "border border-neutral-300 text-neutral-400"
                                }`}
                            >
                                {done ? (
                                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                        <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    step
                                )}
                            </span>
                            <span className={`text-[13px] ${active ? "font-medium text-neutral-900" : "text-neutral-400"}`}>
                                {label}
                            </span>
                        </div>
                        {step < STEPS.length && <span className="h-px w-8 bg-neutral-200" />}
                    </div>
                )
            })}
        </div>
    )
}