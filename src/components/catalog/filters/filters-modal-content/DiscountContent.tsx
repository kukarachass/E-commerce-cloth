import {discounts} from "@/mocks/catalogStore";
import FilterCheckbox from "@/components/catalog/filters/filters-modal-content/FilterCheckbox";
import {useFiltersStore} from "@/store/useFiltersStore";
import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton";

export default function DiscountContent(){
    const checkedDiscounts = useFiltersStore(s => s.discounts);
    const toggleDiscounts = useFiltersStore(s => s.toggleDiscount)
    return(
        <div className="flex flex-col gap-3">
            <div className="flex flex-col">
                {discounts.map((discount) => (
                    <FilterCheckbox
                        key={discount}
                        label={`From ${discount.toString()}% off`}
                        checked={checkedDiscounts.includes(discount.toString())}
                        onChange={() => toggleDiscounts(discount.toString())}
                    />
                ))}
            </div>
            <ResetButton/>
        </div>
    )
}