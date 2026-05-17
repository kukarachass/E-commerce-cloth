export default function ContactCard({ icon, title, description, action, actionLabel }: {
    icon: React.ReactNode
    title: string
    description: string
    action: () => void
    actionLabel: string
}) {
    return (
        <div className="flex flex-col gap-3 p-6 border border-gray-300 rounded-2xl hover:border-black transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[var(--text)]">
                {icon}
            </div>
            <div>
                <p className="text-[15px] font-semibold text-[var(--text)]">{title}</p>
                <p className="text-[13px] text-[#999] mt-0.5">{description}</p>
            </div>
            <button
                onClick={action}
                className="text-[13px] font-medium text-[var(--text)] underline underline-offset-2 text-left cursor-pointer hover:opacity-60 transition-opacity"
            >
                {actionLabel}
            </button>
        </div>
    )
}