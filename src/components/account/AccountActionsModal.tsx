import MyOrdersButton from "@/components/account/nav-items/MyOrdersButton";
import ReturnsButton from "@/components/account/nav-items/ReturnsButton";
import MyProfileButton from "@/components/account/nav-items/MyProfileButton";
import CustomerServiceButton from "@/components/account/nav-items/CustomerServiceButton";
import LogOutButton from "@/components/account/nav-items/LogOutButton";

export default function AccountActionsModal(){
    return(
        <div className="bg-white p-4 shadow-md flex flex-col min-w-[256px]">
            <MyOrdersButton/>
            <ReturnsButton/>
            <MyProfileButton/>
            <CustomerServiceButton/>
            <LogOutButton/>
        </div>
    )
}