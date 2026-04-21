interface Props{
    setSearchOpen: (value: boolean) => void
    className?: string;
}

export default function Search({setSearchOpen, className}: Props){
    return(
        <div className={`${className} flex items-center w-full gap-3`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="black" strokeWidth="2"/>
                <path d="M16.5 16.5L21 21" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
                autoFocus
                placeholder="What are you looking for?"
                className="flex-1 outline-none text-[16px] bg-transparent"
            />
            <button onClick={() => setSearchOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L13 13" stroke="black" strokeWidth="2"/>
                    <path d="M13 3L3 13" stroke="black" strokeWidth="2"/>
                </svg>
            </button>
        </div>
    )
}