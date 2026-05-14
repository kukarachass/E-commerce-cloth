import SpecialOfferBlock from "@/components/sections/special-offers/SpecialOfferBlock";

export default function SpecialOffers(){
    return(
        <div className="flex flex-row gap-6">
            <SpecialOfferBlock/>
            <SpecialOfferBlock/>
            <SpecialOfferBlock/>
        </div>
    )
}