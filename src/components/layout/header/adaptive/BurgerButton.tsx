import {useMobileMenuStore} from "@/store/adaptive/useMobileMenuStore";

export default function BurgerButton () {
    const setMenuOpen = useMobileMenuStore(state => state.setOpen)

    return (
        <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            className="flex flex-col justify-center gap-[5px] shrink-0 cursor-pointer"
        >
            <span className="block w-5 h-[1.5px] bg-black" />
            <span className="block w-5 h-[1.5px] bg-black" />
            <span className="block w-5 h-[1.5px] bg-black" />
        </button>
    )
}