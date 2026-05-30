import {discounts} from "@/mocks/catalogStore";
import FilterCheckbox from "@/components/catalog/filters/filters-modal-content/FilterCheckbox";
import {useFiltersStore} from "@/store/useFiltersStore";
import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton";
import {Discount} from "@/types/filters/discount";
import {useFilters} from "@/hooks/useFilters";

interface DiscountContentProps {
    discounts: Discount[];
}

export default function DiscountContent({ discounts }: DiscountContentProps) {
    const { setFilter, isSelected } = useFilters()

    return(
        <div className="flex flex-col gap-3">
            <div className="flex flex-col">
                {discounts.map((discount) => (
                    <FilterCheckbox
                        key={discount.discount}
                        label={`From ${discount.discount.toString()}% off`}
                        checked={isSelected("discount", discount.discount.toString())}
                        onChange={() => setFilter("discount", discount.discount.toString())}
                    />
                ))}
            </div>
            <ResetButton keyName={"discount"}/>
        </div>
    )
}