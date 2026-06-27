export const RETURN_REASONS = [
    { value: "size",             label: "Wrong size" },
    { value: "fit",              label: "Doesn’t fit" },
    { value: "changed_mind",     label: "Changed my mind" },
    { value: "defective",        label: "Damaged or defective" },
    { value: "wrong_item",       label: "Wrong item received" },
    { value: "not_as_described", label: "Not as described" },
] as const

export type ReturnReason = (typeof RETURN_REASONS)[number]["value"]

export const REASON_LABEL: Record<ReturnReason, string> = Object.fromEntries(
    RETURN_REASONS.map((r) => [r.value, r.label]),
) as Record<ReturnReason, string>