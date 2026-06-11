export default function GenderSelect({ value, onChange }: { value: string | null | undefined; onChange: (v: string) => void }) {
    return (
        <div className="relative w-full">
            <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="py-3 px-4 w-full text-[16px] border border-[#ccc] rounded-[10px] text-[var(--text)] appearance-none cursor-pointer bg-white"
            >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
            {value && (
                <span className="absolute left-3 bottom-10 bg-white px-1 rounded text-[12px] text-[var(--text)] font-bold shadow-sm">
                    Gender
                </span>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    )
}
