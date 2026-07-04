interface Props {
    icon: React.ReactNode
    title: string
    description: string
    action: () => void
    actionLabel: string
}

export default function ContactCard({ icon, title, description, action, actionLabel }: Props) {
    return (
        <div className="flex flex-col gap-4 p-5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors duration-150">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                {icon}
            </div>
            <div className="flex flex-col gap-0.5">
                <p className="text-[14px] font-semibold text-neutral-900">{title}</p>
                <p className="text-[12px] text-neutral-400">{description}</p>
            </div>
            <button
                onClick={action}
                className="w-fit text-[13px] font-medium text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 transition-colors pb-px"
            >
                {actionLabel}
            </button>
        </div>
    )
}