interface Props {
    title: string
    resultCount: number
}

export default function CategoryHeader({ title, resultCount }: Props) {
    return (
        <div className="flex flex-row items-center gap-3 px-4">
            <h1 className="text-[20px] sm:text-[24px] leading-[133%] font-bold text-neutral-900">
                {title}
            </h1>
            <span className="flex items-center shrink-0 text-neutral-600 font-semibold text-[12px] sm:text-[13px] bg-neutral-100 rounded-full px-2.5 py-0.5">
                {resultCount} results
            </span>
        </div>
    )
}