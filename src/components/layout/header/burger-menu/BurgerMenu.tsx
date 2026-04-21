import {useState} from "react";
import Image from "next/image";
import GenderSwitcher from "@/components/layout/header/GenderSwitcher";
import Link from "next/link";

export default function BurgerMenu({ className }: {className?: string}) {
    const [open, setOpen] = useState(false);
    const navElements = [
        { text: "New Items", href: "/"},
        { text: "Clothing", href: "/"},
        { text: "Sportswear", href: "/"},

        { text: "Shoes", href: "/"},
        { text: "Accessories", href: "/"},
        { text: "Brands", href: "/"},
    ]

    return (
        <div className={`${className} relative`}>
            <button className="pt-[5px]" onClick={() => setOpen(!open)}>
                <Image src={"burger-menu.svg"} alt={"search"} width={24} height={24}/>
            </button>

            {/* Backdrop */}
            <div
                onClick={() => setOpen(false)}
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />

            {/* Drawer */}
            <div className={`fixed top-0 left-0 h-full w-full max-w-[320px] sm:max-w-[500px] bg-white z-50 transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col gap-3">
                    <div className="relative flex justify-center items-center py-[10px] px-4">
                        <span className="text-[20px] text-[var(--text)] font-bold">Menu</span>
                        <button onClick={() => setOpen(false)} className="absolute right-4">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3L13 13" stroke="black" strokeWidth="2" />
                                <path d="M13 3L3 13" stroke="black" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>
                    <div className="px-2">
                        <GenderSwitcher/>
                    </div>
                    <div className={"flex flex-col border-b border-[#f0f0f0] pb-4"}>
                        {navElements.map((el) => (
                            <div key={el.text} className="flex flex-row justify-between w-full py-3 px-4">
                                <Link className="text-[var(--text)] text-[16px] font-medium" href={el.href}>{el.text}</Link>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 12L10 8L6 4" stroke="black" strokeWidth="2" />
                                </svg>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <Link href={"/account"} className="flex flex-row gap-2 cursor-pointer items-center px-4 border-b pb-4 border-[#f0f0f0]">
                            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_43_1787)">
                                    <path d="M6.90918 4.90878C6.90918 7.16661 8.74225 8.99969 11.0001 8.99969C13.2579 8.99969 15.091 7.16661 15.091 4.90878C15.091 2.65095 13.2579 0.817871 11.0001 0.817871C8.74225 0.817871 6.90918 2.65095 6.90918 4.90878V4.90878" stroke="black" strokeWidth="1.63636" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.182 18.818H17.5456C17.5456 15.2033 14.6149 12.2726 11.0002 12.2726C7.38545 12.2726 4.45472 15.2033 4.45472 18.818H2.81836C2.81836 14.2992 6.48136 10.6362 11.0002 10.6362C15.519 10.6362 19.182 14.2992 19.182 18.818V18.818" fill="black" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_43_1787">
                                        <rect width="22" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span className="text-[var(--text)] text-[16px] font-medium">My Account</span>
                        </Link>
                        <Link href={"/account"} className="flex flex-row gap-2 cursor-pointer items-center p-4 border-b border-[#f0f0f0]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.375 4.5C17.1382 4.5 21 7.5225 21 11.25C21 14.9775 17.1382 18 12.375 18C11.895 18 11.4225 17.9692 10.9643 17.91L6.23925 19.719L6.87075 16.4475C4.965 15.2093 3.75 13.3402 3.75 11.25C3.75 7.5225 7.61175 4.5 12.375 4.5V4.5" stroke="#333333" strokeWidth="2" />
                                <path d="M9.25 11.25C9.25 11.3881 9.13807 11.5 9 11.5C8.86193 11.5 8.75 11.3881 8.75 11.25C8.75 11.1119 8.86193 11 9 11C9.13807 11 9.25 11.1119 9.25 11.25V11.25" fill="black" />
                                <path d="M9.25 11.25C9.25 11.3881 9.13807 11.5 9 11.5C8.86193 11.5 8.75 11.3881 8.75 11.25C8.75 11.1119 8.86193 11 9 11C9.13807 11 9.25 11.1119 9.25 11.25V11.25" stroke="#333333" />
                                <path d="M12.375 12C12.7892 12 13.125 11.6642 13.125 11.25C13.125 10.8358 12.7892 10.5 12.375 10.5C11.9608 10.5 11.625 10.8358 11.625 11.25C11.625 11.6642 11.9608 12 12.375 12V12" fill="black" />
                                <path d="M15.75 12C16.1642 12 16.5 11.6642 16.5 11.25C16.5 10.8358 16.1642 10.5 15.75 10.5C15.3358 10.5 15 10.8358 15 11.25C15 11.6642 15.3358 12 15.75 12V12" fill="black" />
                            </svg>
                            <span className="text-[var(--text)] text-[16px] font-medium">Customer Service</span>
                        </Link>
                        <Link href={"/account"} className="flex flex-row gap-2 cursor-pointer items-center p-4 border-b border-[#f0f0f0]">
                            <Image src={"language.svg"} alt={"language"} width={24} height={24}/>
                            <span className="text-[var(--text)] text-[16px] font-medium">Language</span>
                        </Link>
                    </div>

                    <button className="py-1 mt-3 font-bold px-4 max-w-[200px] w-full mx-auto rounded border border-[#f0f0f0]">
                        Logout
                    </button>
                </div>

            </div>
        </div>
    )
}