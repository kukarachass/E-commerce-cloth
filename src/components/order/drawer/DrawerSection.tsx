import { ReactNode } from "react"

interface Props {
    title: string
    children: ReactNode
}

export function DrawerSection({ title, children }: Props) {
    return (
        <section className="px-5 py-5">
            <p className="text-[11px] font-medium tracking-widest text-neutral-400 uppercase mb-3">
                {title}
            </p>
            {children}
        </section>
    )
}