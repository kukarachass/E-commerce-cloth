import cn from "classnames";
import {motion} from "framer-motion";

export default function SidebarCheckbox({ checked }: { checked: boolean }) {
    return (
        <div className={cn(
            "w-4 h-4 border rounded-sm flex items-center justify-center shrink-0 transition-colors",
            { "border-black": checked, "border-gray-300": !checked }
        )}>
            <motion.div
                initial={false}
                animate={{ scale: checked ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                className="w-2 h-2 bg-black rounded-[2px]"
            />
        </div>
    )
}