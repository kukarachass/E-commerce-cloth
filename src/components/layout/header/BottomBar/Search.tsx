import { useSearchStore } from "@/store/useSearchOpen";
import {useSearchQueryStore} from "@/store/useSearchQueryStore";
import {useEffect} from "react";

export default function Search() {
    const setSearchOpen = useSearchStore(state => state.setSearchOpen);
    const searchOpen = useSearchStore(state => state.searchOpen);
    const setQuery = useSearchQueryStore(state => state.setQuery);
    const query = useSearchQueryStore(state => state.query);

    useEffect(() => {
        if(!searchOpen) setQuery("");
    }, [searchOpen]);

    const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> ) => {
        e.stopPropagation();
        setSearchOpen(false)
        setQuery("");
    }

    return (
        <div
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 border-b border-gray-200 pb-1 cursor-pointer"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M3 10C3 13.8634 6.13659 17 10 17C13.8634 17 17 13.8634 17 10C17 6.13659 13.8634 3 10 3C6.13659 3 3 6.13659 3 10V10" stroke="#333" strokeWidth="2" />
                <path d="M15 15L21 21" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
                value={query}
                onChange={(e) => {setQuery(e.target.value)}}
                type="text"
                placeholder="What are you looking for?"
                className="text-[16px] placeholder-gray-400 bg-transparent outline-none cursor-pointer w-full"
            />
            {searchOpen && (
                <button
                    onClick={(e) => {
                        handleClose(e)
                    }}
                    className="shrink-0 cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 3L13 13" stroke="black" strokeWidth="2" />
                        <path d="M13 3L3 13" stroke="black" strokeWidth="2" />
                    </svg>
                </button>
            )}
        </div>
    )
}