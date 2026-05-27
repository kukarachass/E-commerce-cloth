import {Search} from "lucide-react"
import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton";
import FilterCheckbox from "@/components/catalog/filters/filters-modal-content/FilterCheckbox";
import {useState} from "react";
import {Brand} from "@/types/brands";
import {useFilters} from "@/hooks/useFilters";

interface BrandsContentProps {
    brands: Brand[];
}

export default function BrandsContent({ brands }: BrandsContentProps) {
    const { setFilter, isSelected } = useFilters()
    const [value, setValue] = useState("")

    const filtered = value
        ? brands.filter(b => b.name.toLowerCase().includes(value.toLowerCase()))
        : brands


    return (
        <div className="flex flex-col cursor-pointer">
            <div className="flex flex-col gap-2 p-3 border-b border-gray-100">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                    <Search size={14} className="text-gray-400 shrink-0"/>
                    <input
                        value={value}
                        onChange={e => {
                            setValue(e.target.value)
                        }}
                        className="text-[14px] outline-none bg-transparent w-full placeholder-gray-400"
                        placeholder="Search brand"
                    />
                </div>
                <label
                    className="flex gap-3 p-2 items-center bg-gray-50 rounded-[8px] cursor-pointer transition-colors">
                    <div className="w-4 h-4 border border-gray-300 rounded-sm shrink-0"/>
                    <span className="text-[14px] text-[var(--text)]">Select my favourites brands</span>
                </label>
            </div>
            <div className="flex flex-col overflow-y-auto max-h-[280px] py-2">
                {filtered.map((brand) => (
                    <FilterCheckbox
                        key={brand.id}
                        label={brand.name}
                        checked={isSelected("brand", brand.slug)}
                        onChange={() => setFilter("brand", brand.slug)}
                    />
                ))}
            </div>
            <ResetButton/>
        </div>
    )
}