export default function CategoryField({
                   label,
                   error,
                   hint,
                   children,
               }: {
    label: string;
    error?: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="grid gap-1">
            <span className="text-sm text-gray-600">{label}</span>
            {children}
            {hint && !error && <span className="text-xs text-gray-400">{hint}</span>}
            {error && <span className="text-red-600 text-sm">{error}</span>}
        </label>
    );
}