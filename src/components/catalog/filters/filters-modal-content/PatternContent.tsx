import FilterCheckbox from "@/components/catalog/filters/filters-modal-content/FilterCheckbox";
import {useFiltersStore} from "@/store/useFiltersStore";
import {patterns} from "@/mocks/catalogStore";
import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton";

export default function PatternContent() {
    const togglePattern = useFiltersStore(s => s.togglePattern)
    const checkedPatterns = useFiltersStore(s => s.patterns);

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2">
                {patterns.map((pattern) => (
                    <FilterCheckbox
                        key={pattern}
                        label={pattern}
                        checked={checkedPatterns.includes(pattern)}
                        onChange={() => togglePattern(pattern)}
                    />
                ))}
            </div>
            <ResetButton/>
        </div>
    )
}