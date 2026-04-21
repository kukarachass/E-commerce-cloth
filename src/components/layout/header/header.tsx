"use client"

import PromoBar from "@/components/layout/header/PromoBar";
import GenderSwitcher from "@/components/layout/header/GenderSwitcher";
import Image from "next/image";
import HeaderActions from "@/components/layout/header/header-actions/HeaderActions";
import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import HeaderNavAndSearch from "@/components/layout/header/HeaderNavAndSearch";
import BurgerMenu from "@/components/layout/header/burger-menu/BurgerMenu";
import AdaptiveSearchIcon from "@/components/layout/header/burger-menu/AdaptiveSearchIcon";
import Search from "@/components/layout/header/Search";

export default function Header() {
    const [searchOpen, setSearchOpen] = useState(false)

    return (
        <>
            <div className="flex flex-col gap-4 bg-[var(--header-bg)] relative z-50">
                <div className="w-full bg-black">
                    <PromoBar/>
                </div>
                <div className="max-w-[1200px] justify-between w-full mx-auto sticky top-0 z-50 py-[12px] flex p-2">
                    {searchOpen ? (
                        <>
                            {/* На мобиле — полная замена строки */}
                            <div className="flex lg:hidden items-center w-full gap-3">
                                <Search className="pb-4" setSearchOpen={setSearchOpen}/>
                            </div>
                            {/* На десктопе — обычная шапка */}
                            <div className="hidden lg:flex justify-between w-full items-center">
                                <GenderSwitcher/>
                                <Image src={"logo.svg"} alt={"logo"} width={100} height={24}/>
                                <HeaderActions/>
                            </div>
                        </>
                    ) : (
                        <>
                            <GenderSwitcher className="hidden lg:flex"/>
                            <div className="lg:hidden flex items-center gap-4">
                                <BurgerMenu/>
                                <AdaptiveSearchIcon searchOpen={searchOpen} setSearchOpen={setSearchOpen}/>
                            </div>
                            <Image src={"logo.svg"} alt={"logo"} width={100} height={24}/>
                            <HeaderActions/>
                        </>
                    )}
                </div>
                <HeaderNavAndSearch className="hidden lg:flex" setSearchOpen={setSearchOpen} searchOpen={searchOpen}/>
            </div>

            {/* затемнение — вне хедера, не влияет на layout */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.25}}
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={() => setSearchOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}