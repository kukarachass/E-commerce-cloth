import CloseButtonSvg from "@/components/ui/buttons/CloseButtonSvg";

export default function TopBar(){
    return(
        <div className="bg-black">
            <div className="relative flex items-center justify-center max-w-[1200px] mx-auto text-center py-4">
                <span className="text-white">New customer? Use code WELCOME for all deals + free delivery.</span>
                <CloseButtonSvg className="absolute right-0"/>
            </div>
        </div>
    )
}