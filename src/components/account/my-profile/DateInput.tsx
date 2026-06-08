export default function DateInput({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
    return (
        <div className="relative w-full">
            <input
                type="date"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="py-3 px-4 w-full text-[16px] border border-[#ccc] rounded-[10px] text-[var(--text)] bg-white cursor-pointer"
            />
            {value && (
                <span className="absolute left-3 bottom-10 bg-white px-1 rounded text-[12px] text-[var(--text)] font-bold shadow-sm">
                    Date of birth
                </span>
            )}
        </div>
    )
}
