import BrandsSwitcher from "@/components/sections/brands-explore/BrandsSwitcher";

export default function ExploreBrands(){
    return(
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-[var(--text)] text-[24px] font-bold leading-[125%]">Explore more</h1>
            </div>
            <BrandsSwitcher/>
        </div>
    )
}