import React from "react";

const FormInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
    return (
        <input
            ref={ref}
            {...props}
            className={`peer w-full rounded-lg border border-gray-300 px-4 py-2 pr-11 text-[var(--text)] text-[16px]
                       bg-white focus:outline-none ${props.className}`}
        />
    );
});

FormInput.displayName = "Input";
export default FormInput;