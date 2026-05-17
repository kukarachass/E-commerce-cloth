import EmptyPage from "@/components/account/EmptyPage";

export default function MyOrdersPage(){
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-[var(--text)] text-[24px] font-bold">My Orders</h1>
            <EmptyPage pageName={"orders"}/>
        </div>
    )
}