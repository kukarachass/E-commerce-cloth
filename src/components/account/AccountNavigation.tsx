"use client"

import MyOrdersButton from "@/components/account/nav-items/MyOrdersButton";
import ReturnsButton from "@/components/account/nav-items/ReturnsButton";
import MyProfileButton from "@/components/account/nav-items/MyProfileButton";
import CustomerServiceButton from "@/components/account/nav-items/CustomerServiceButton";

export default function AccountNavigation() {

    return (
        <div className="flex flex-col text-[var(--text)] w-full max-w-[256px]">
            <h1 className="text-[21px] font-bold pb-4 border-b border-gray-300">My Account</h1>
            <MyOrdersButton/>
            <ReturnsButton/>
            <MyProfileButton/>
            <CustomerServiceButton/>
        </div>
    )
}