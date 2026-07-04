import GenderSwitcher from "@/components/layout/header/GenderSwitcher";
import CloseIconSvg from "@/components/ui/icons/CloseIconSvg";

interface MobileMenuHeaderProps {
    handleClose: () => void
}

export default function MobileMenuHeader({handleClose}: MobileMenuHeaderProps) {
    return (
        <div className="flex flex-col items-center">
            <div className="relative flex flex-row items-center px-5 py-4">
                <h1 className="text-[var(--text)] font-bold text-[20px] flex justify-center text-center">Menu</h1>
            </div>
            <button
                onClick={handleClose}
                aria-label="Close menu"
                className="absolute right-3 top-[21px] cursor-pointer"
            >
                <CloseIconSvg/>
            </button>

            <GenderSwitcher className="max-w-[300px]"/>
        </div>
    )
}