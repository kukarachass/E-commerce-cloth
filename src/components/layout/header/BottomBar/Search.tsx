import {useSearchStore} from "@/store/useSearchOpen";

export default function Search(){
    const setSearchOpen = useSearchStore(state => state.setSearchOpen);
    const searchOpen = useSearchStore(state => state.searchOpen);

    return(
        <div onClick={()=>setSearchOpen(!searchOpen)}>
            <input type="text"
                   className="border border-gray-300 rounded w-full max-w-[200px] p-2 focus:outline-none"
                   placeholder="Search..."
            />
        </div>
    )
}