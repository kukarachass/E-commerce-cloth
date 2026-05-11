export default function FilterDropdown({ children }: { children: React.ReactNode }) {
    return(
        <div onClick={(e) => e.stopPropagation()} className="px-2 pt-2 top-[40px] left-0 flex flex-col absolute bg-white rounded-[10px] border border-[#ddd] min-w-[300px] h-fit">
            {children}
        </div>
    )
}