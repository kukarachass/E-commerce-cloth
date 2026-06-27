export default function ReturnSuccess({ returnId, onDone }: { returnId: string; onDone: () => void }) {
    return (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="flex flex-col gap-1">
                <h2 className="text-[18px] font-semibold text-neutral-900">Return requested</h2>
                <p className="text-[13px] text-neutral-500">
                    Reference <span className="font-mono text-neutral-700">#{returnId.slice(0, 8).toUpperCase()}</span>.
                    We’ve emailed you the next steps.
                </p>
            </div>
            <button
                onClick={onDone}
                className="mt-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800"
            >
                Done
            </button>
        </div>
    )
}