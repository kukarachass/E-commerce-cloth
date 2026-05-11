import {useEffect, useRef, useState} from "react";
import Arrow from "@/components/ui/icons/Arrow";
import {sortVariants} from "@/mocks/catalogStore";
import {useFiltersStore} from "@/store/useFiltersStore";
import useClickOutside from "@/hooks/useClickOutside";

export default function Sort() {
    const [open, setOpen] = useState(false)
    const setSort = useFiltersStore(s => s.setSort)
    const selectedSort = useFiltersStore(s => s.sort);
    useEffect(() => {
        console.log(selectedSort)
    }, [selectedSort]);

    const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))

    const sort = sortVariants;

    return (
        <div ref={ref} className="relative">
            <div onClick={() => setOpen(!open)}
                 className="flex cursor-pointer select-none flex-row items-center gap-2">
                 <span className="capitalize text-[15px] font-bold leading-[150%]">{selectedSort}</span>
                <Arrow className={`${open ? "rotate-180 " : ""} transition-all duration-200`}/>
            </div>
            {open && (
                <div className="p-2 top-[40px] min-w-[200px] right-0 flex flex-col absolute bg-white rounded-[10px] border border-[#ddd] h-fit">
                    {sort.map((sort) => (
                        <div
                            onClick={() => setSort(sort)}
                            key={sort}
                            className="select-none capitalize hover:bg-gray-100 flex flex-row items-center gap-3 text-[var(--text)] text-[14px] font-bold cursor-pointer  rounded-[4px] px-2 py-[4px] bg-white"
                        >
                            {sort}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}