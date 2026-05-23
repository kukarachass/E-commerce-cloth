import { InputHTMLAttributes } from "react"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string
}

export default function FloatingLabelInput({ label, className, value, ...rest }: Props) {
    const hasValue = Boolean(value)

    return (
        <div className={`${className} relative`}>
            <input
                {...rest}
                className="py-3 px-4 w-full text-[14px] border border-[#ccc] rounded-[10px] text-[var(--text)]"
                placeholder={rest.placeholder ?? label}
                type="text"
            />
            {hasValue && (
                <span className="absolute left-3 bottom-10 bg-white px-1 rounded text-[13px] text-[var(--text)] font-bold shadow-sm">
                    {label}
                </span>
            )}
        </div>
    )
}