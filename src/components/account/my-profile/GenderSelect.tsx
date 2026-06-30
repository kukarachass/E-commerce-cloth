export default function GenderSelect({
                                         value,
                                         onChange,
                                     }: {
    value: string | null | undefined
    onChange: (v: string) => void
}) {
    return (
        <div className="relative w-full">
            <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className={`
                    w-full appearance-none rounded-lg border bg-white
                    px-3 py-2.5 text-[13px] outline-none transition-colors cursor-pointer
                    ${value
                    ? "border-neutral-300 text-neutral-900"
                    : "border-neutral-200 text-neutral-400"
                }
                    focus:border-neutral-900
                `}
            >
                <option value="" disabled>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                width="12" height="12" viewBox="0 0 12 12" fill="none"
            >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}