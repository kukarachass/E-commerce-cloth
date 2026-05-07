import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton";
import {styles} from "@/mocks/catalogStore";
import {useFiltersStore} from "@/store/useFiltersStore";
import FilterCheckbox from "@/components/catalog/filters/filters-modal-content/FilterCheckbox";

export default function StyleContent() {

    const checkedStyles = useFiltersStore(s => s.styles);
    const toggleStyles = useFiltersStore(s => s.toggleStyle)

    const { clothStyles } = styles;
    return(
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-1">
                {clothStyles.map((style) => (
                    <FilterCheckbox
                        key={style}
                        label={style}
                        checked={checkedStyles.includes(style)}
                        onChange={() => toggleStyles(style)}
                    />
                ))}
            </div>
            <ResetButton/>
        </div>
    )
}