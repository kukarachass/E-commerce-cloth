import FilterCheckbox from "@/components/catalog/filters/filters-modal-content/FilterCheckbox";
import {useFiltersStore} from "@/store/useFiltersStore";
import {patterns} from "@/mocks/catalogStore";
import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton";
import {Pattern} from "@/types/filters/pattern";
import {useFilters} from "@/hooks/useFilters";

interface PatternContentProps {
    patterns: Pattern[];
}

export default function PatternContent({ patterns }: PatternContentProps) {
    const { setFilter, isSelected } = useFilters()

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2">
                {patterns.map((pattern) => (
                    <FilterCheckbox
                        key={pattern.pattern}
                        label={pattern.pattern}
                        checked={isSelected("pattern", pattern.pattern)}
                        onChange={() => setFilter("pattern", pattern.pattern)}
                    />
                ))}
            </div>
            <ResetButton keyName={"pattern"}/>
        </div>
    )
}