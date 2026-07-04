"use client"

import {motion, AnimatePresence} from "framer-motion"
import {useMobileMenuStore} from "@/store/adaptive/useMobileMenuStore";
import MobileMenuActions from "@/components/layout/header/adaptive/MobileMenuActions";
import MobileMenuHeader from "@/components/layout/header/adaptive/mobile-menu/MobileMenuHeader";
import MobileMenuLinks from "@/components/layout/header/adaptive/mobile-menu/MobileMenuLinks";
import {useState} from "react";
import SubCatsNavPage from "@/components/layout/header/adaptive/mobile-menu/SubCatsNavPage";

export type catsSlug = "clothing" | "sportswear" | "accessories" | "shoes"

export default function MobileMenu() {
    const isOpen = useMobileMenuStore(state => state.isOpen)
    const setOpen = useMobileMenuStore(state => state.setOpen)
    const handleClose = () => setOpen(false)
    const [showSubCats, setShowSubCats] = useState<catsSlug | null>(null)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="mobile-menu-backdrop"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                        className="fixed inset-0 bg-black/40 z-50 lg:hidden"
                        onClick={handleClose}
                    />

                    {/* Drawer */}
                    <motion.aside
                        key="mobile-menu-drawer"
                        initial={{x: "-100%"}}
                        animate={{x: 0}}
                        exit={{x: "-100%"}}
                        transition={{duration: 0.3, ease: "easeInOut"}}
                        className="fixed inset-y-0 left-0 sm:max-w-[560px] max-w-[320px] w-full bg-white z-[51] flex flex-col shadow-xl lg:hidden"
                        aria-label="Navigation menu"
                    >
                        {showSubCats ? (
                            <SubCatsNavPage onClose={() => setOpen(false)} setShowSubCats={setShowSubCats} catSlug={showSubCats} />
                        ): (
                            <>
                                <MobileMenuHeader handleClose={handleClose}/>

                                <MobileMenuLinks setShowSubCats={setShowSubCats} handleClose={handleClose}/>

                                <MobileMenuActions onClose={handleClose}/>
                            </>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}
