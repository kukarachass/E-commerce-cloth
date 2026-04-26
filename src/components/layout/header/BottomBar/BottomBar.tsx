import HeaderNav from "@/components/layout/header/BottomBar/HeaderNav";
import Search from "@/components/layout/header/BottomBar/Search";
import {useStickyStore} from "@/store/useStickyStore";

export default function BottomBar(){
    const isSticky = useStickyStore(state => state.isSticky)
    return(
        <div className="bg-white">
            <div className="max-w-[1200px] mx-auto flex justify-between items-center py-4">
                <HeaderNav/>
                {!isSticky && (
                    <Search/>
                )}
            </div>
        </div>
    )
}