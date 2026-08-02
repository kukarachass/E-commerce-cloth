import type {
    InputHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from "react";
import { AlertCircle } from "lucide-react";
import cn from "@/app/(admin)/admin/_lib/cn";

/* ── общая база для всех полей ввода ───────────────────────── */

const CONTROL = [
    "w-full rounded-field border bg-card px-3.5 text-sm text-ink",
    "placeholder:text-ink-faint",
    "transition-[border-color,box-shadow] duration-200",
    "focus:border-ink/30 focus:outline-2 focus:outline-offset-2 focus:outline-accent",
    "disabled:cursor-not-allowed disabled:bg-sunk disabled:text-ink-faint",
].join(" ");

const controlTone = (invalid?: boolean) =>
    invalid ? "border-critical/50 bg-critical-soft/40" : "border-line-strong";

/* ── обёртка «подпись + контрол + ошибка» ──────────────────── */

export function Field({
    label,
    error,
    hint,
    children,
    className,
    optional,
}: {
    label?: ReactNode;
    error?: string;
    hint?: ReactNode;
    children: ReactNode;
    className?: string;
    optional?: boolean;
}) {
    return (
        <label className={cn("grid gap-1.5", className)}>
            {label && (
                <span className="flex items-center gap-2 text-xs font-medium text-ink-soft">
                    {label}
                    {optional && (
                        <span className="text-[10px] font-normal tracking-wide text-ink-faint uppercase">
                            optional
                        </span>
                    )}
                </span>
            )}

            {children}

            {error ? (
                <span className="flex items-center gap-1.5 text-xs text-critical">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {error}
                </span>
            ) : (
                hint && <span className="text-xs text-ink-faint">{hint}</span>
            )}
        </label>
    );
}

/* ── контролы ──────────────────────────────────────────────── */

export function Input({
    className,
    invalid,
    ...rest
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
    return (
        <input
            className={cn(CONTROL, controlTone(invalid), "h-11", className)}
            {...rest}
        />
    );
}

export function Textarea({
    className,
    invalid,
    rows = 4,
    ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
    return (
        <textarea
            rows={rows}
            className={cn(
                CONTROL,
                controlTone(invalid),
                "resize-y py-2.5 leading-relaxed",
                className,
            )}
            {...rest}
        />
    );
}

export function Select({
    className,
    invalid,
    children,
    ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
    return (
        <span className="relative block">
            <select
                className={cn(
                    CONTROL,
                    controlTone(invalid),
                    "h-11 cursor-pointer appearance-none pr-9",
                    className,
                )}
                {...rest}
            >
                {children}
            </select>
            <svg
                viewBox="0 0 10 6"
                className="pointer-events-none absolute top-1/2 right-3.5 h-1.5 w-2.5 -translate-y-1/2 text-ink-faint"
                aria-hidden
            >
                <path
                    d="M1 1l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </svg>
        </span>
    );
}

/** Тумблер поверх нативного чекбокса: форма по-прежнему шлёт name/value */
export function Switch({
    label,
    hint,
    className,
    ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
    label: ReactNode;
    hint?: ReactNode;
}) {
    return (
        <label
            className={cn(
                "flex cursor-pointer items-center justify-between gap-4 rounded-field border border-line-strong bg-card px-3.5 py-3",
                "transition-colors hover:border-ink/20",
                className,
            )}
        >
            <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">{label}</span>
                {hint && (
                    <span className="mt-0.5 block text-xs text-ink-faint">{hint}</span>
                )}
            </span>

            <span className="relative inline-flex shrink-0">
                <input type="checkbox" className="peer sr-only" {...rest} />
                <span className="h-6 w-11 rounded-full bg-line-strong transition-colors peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent" />
                <span className="pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
            </span>
        </label>
    );
}

/* ── раскладка формы ───────────────────────────────────────── */

/** Блок формы: заголовок слева на широком экране, поля справа */
export function FormSection({
    title,
    description,
    children,
    aside,
}: {
    title: string;
    description?: string;
    children: ReactNode;
    aside?: ReactNode;
}) {
    return (
        <section className="grid gap-4 border-b border-line pb-7 last:border-0 last:pb-0 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
            <div className="lg:pt-1">
                <h2 className="text-sm font-semibold text-ink">{title}</h2>
                {description && (
                    <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                        {description}
                    </p>
                )}
                {aside && <div className="mt-3">{aside}</div>}
            </div>
            <div className="grid content-start gap-4">{children}</div>
        </section>
    );
}

/** Липкая панель сохранения — не надо скроллить в конец длинной формы */
export function FormFooter({
    children,
    hint,
}: {
    children: ReactNode;
    hint?: ReactNode;
}) {
    return (
        <div className="sticky bottom-4 z-10 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-full border border-line-strong bg-card/85 px-4 py-2.5 shadow-float backdrop-blur-md">
            <span className="min-w-0 truncate text-xs text-ink-faint">{hint}</span>
            <div className="flex items-center gap-2">{children}</div>
        </div>
    );
}

/** Сообщение об ошибке уровня формы */
export function FormError({ message }: { message?: string | null }) {
    if (!message) return null;
    return (
        <p className="flex items-start gap-2 rounded-field border border-critical/25 bg-critical-soft px-3.5 py-2.5 text-sm text-critical">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {message}
        </p>
    );
}
