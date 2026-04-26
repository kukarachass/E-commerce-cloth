import GenderSwitcher from "@/components/layout/header/GenderSwitcher";
import Image from "next/image";
import ActionButtons from "@/components/layout/header/ActionButtons";
import cn from "classnames"
import {useStickyStore} from "@/store/useStickyStore";
import {useSearchStore} from "@/store/useSearchOpen";
import SearchDropdown from "@/components/layout/header/SearchDropdown";

export default function MiddleBar(){
    const isSticky = useStickyStore(state => state.isSticky)
    const searchOpen = useSearchStore(state => state.searchOpen);


    return(
        <div className={cn("bg-white sticky top-0",{
            ["shadow-[0_2px_8px_rgba(0,0,0,0.08)]"]: isSticky
        })}>
            <div className="max-w-[1200px] mx-auto flex items-center justify-between py-4">
                <GenderSwitcher/>
                <Image src={"/logo.svg"} alt={"logo"} width={100} height={24}/>
                <ActionButtons/>
            </div>

            {searchOpen && <SearchDropdown />}
        </div>
    )
}