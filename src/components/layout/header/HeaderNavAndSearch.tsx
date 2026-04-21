import {AnimatePresence, motion} from "framer-motion";
import HeaderNav from "@/components/layout/header/HeaderNav";
import SearchDropdown from "@/components/layout/header/SearchDropdown";

interface Props{
    searchOpen: boolean;
    setSearchOpen: (value: boolean) => void;
    className?: string;
}

export default function HeaderNavAndSearch({ searchOpen, setSearchOpen, className }: Props){
    return(
        <>
            <div className={`${className} flex max-w-[1200px] w-full mx-auto overflow-hidden pb-10 p-2`}>
                <motion.div
                    animate={{width: searchOpen ? "0px" : "auto", opacity: searchOpen ? 0 : 1}}
                    transition={{duration: 0.35, ease: "easeInOut"}}
                    className="overflow-hidden whitespace-nowrap shrink-0"
                >
                    <HeaderNav/>
                </motion.div>

                <motion.div
                    animate={{width: searchOpen ? "100%" : "220px"}}
                    transition={{duration: 0.35, ease: "easeInOut"}}
                    className="flex flex-row items-center gap-2 border-b border-gray-300 pb-1 overflow-hidden ml-auto"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                        <path
                            d="M3 10C3 13.8634 6.13659 17 10 17C13.8634 17 17 13.8634 17 10C17 6.13659 13.8634 3 10 3C6.13659 3 3 6.13659 3 10V10"
                            stroke="#333" strokeWidth="2"/>
                        <path d="M15 15L21 21" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input
                        autoFocus={searchOpen}
                        onClick={() => setSearchOpen(true)}
                        className="outline-none text-sm placeholder-gray-400 bg-transparent w-full cursor-pointer"
                        placeholder="Search..."
                        type="text"
                    />
                    {searchOpen && (
                        <button onClick={() => setSearchOpen(false)}
                                className="text-gray-400 text-xl shrink-0">✕</button>
                    )}
                </motion.div>
            </div>

            {/* dropdown */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="absolute top-full left-0 w-full bg-white shadow-md z-40 overflow-hidden"
                    >
                        <SearchDropdown />
                    </motion.div>
                )}
            </AnimatePresence>
        </>

    )
}