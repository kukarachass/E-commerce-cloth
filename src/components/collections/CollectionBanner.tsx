interface Props{
    title: string;
    description: string;
}

export default function CollectionBanner({ title, description }: Props){
    return(
        <div className="flex flex-col gap-2 w-full rounded bg-[#f9f9f9] items-center text-center text-[var(--text)] p-8">
            <h1 className="text-[32px] leading-[125%] font-bold">{title}</h1>
            <p className="text-[16px] leading-[150%]">{description}</p>
        </div>
    )
}