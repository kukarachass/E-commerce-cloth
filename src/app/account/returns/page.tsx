import EmptyPage from "@/components/account/EmptyPage";

export default function ReturnsPage(){
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-[20px] font-semibold text-neutral-900 tracking-tight">Create a Return</h1>
            <EmptyPage pageName={"orders"}/>
        </div>
    )
}

