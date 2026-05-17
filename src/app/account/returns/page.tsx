import EmptyPage from "@/components/account/EmptyPage";

export default function ReturnsPage(){
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-[var(--text)] text-[24px] font-bold">Create a Return</h1>
            <EmptyPage pageName={"orders"}/>
        </div>
    )
}

