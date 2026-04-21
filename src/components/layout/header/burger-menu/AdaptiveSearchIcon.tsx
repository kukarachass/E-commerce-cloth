import Image from "next/image";

interface Props{
    searchOpen: boolean;
    setSearchOpen: (value: boolean) => void;
}

export default function AdaptiveSearchIcon({ setSearchOpen, searchOpen }: Props){
    return(
        <button onClick={() => setSearchOpen(!searchOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10C3 13.8634 6.13659 17 10 17C13.8634 17 17 13.8634 17 10C17 6.13659 13.8634 3 10 3C6.13659 3 3 6.13659 3 10V10" stroke="black" strokeWidth="2" />
                <path d="M15 15L21 21" stroke="black" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </button>
    )
}