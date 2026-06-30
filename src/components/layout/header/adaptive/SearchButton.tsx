import searchJson from "@/components/layout/header/action-buttons/search.json";
import LottieButton from "@/components/layout/header/action-buttons/LottieButton";
import {useSearchStore} from "@/store/useSearchOpen";

export default function SearchButton(){
    const setSearchOpen = useSearchStore(state => state.setSearchOpen)
    const searchOpen = useSearchStore(state => state.searchOpen)
    return(
        <LottieButton
            json={searchJson}
            onClick={() => setSearchOpen(!searchOpen)}
        />
    )
}