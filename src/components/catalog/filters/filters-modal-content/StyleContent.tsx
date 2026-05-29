import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton";
import {styles} from "@/mocks/catalogStore";
import {useFiltersStore} from "@/store/useFiltersStore";
import FilterCheckbox from "@/components/catalog/filters/filters-modal-content/FilterCheckbox";
import {Style} from "@/types/filters/style";
import {useFilters} from "@/hooks/useFilters";

interface StyleContentProps {
    styles: Style[];
}

export default function StyleContent({ styles }: StyleContentProps) {
    const { setFilter, isSelected } = useFilters()
    return(
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-1">
                {styles.map((style) => (
                    <FilterCheckbox
                        key={style.id}
                        label={style.style}
                        checked={isSelected("style", style.style)}
                        onChange={() => setFilter("style", style.style)}
                    />
                ))}
            </div>
            <ResetButton/>
        </div>
    )
}