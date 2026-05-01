import cn from "classnames";

interface Props {
    placeholder?: string;
}

export default function FormInput({placeholder}: Props) {
    return (
        <input
            className={cn("py-3 px-4 w-full text-[16px] border border-[#ccc] rounded-[10px] text-[var(--text)]")}
            placeholder={placeholder}
            type="text"
        />
    )
}