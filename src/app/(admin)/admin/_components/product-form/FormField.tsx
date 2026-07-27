import {ReactNode} from "react";

interface FormFieldProps {
    label: string;
    error?: string;
    hint?: string;
    children: ReactNode;
}

export default function FormField({label, error, hint, children }:FormFieldProps){
    return (
        <label className="grid gap-1">
            <span className="text-sm text-gray-600">{label}</span>
            {children}
            {hint && !error && <span className="text-xs text-gray-400">{hint}</span>}
            {error && <span className="text-red-600 text-sm">{error}</span>}
        </label>
    );
}