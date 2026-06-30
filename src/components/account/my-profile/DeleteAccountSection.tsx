export default function DeleteAccountSection() {
    return (
        <div className="flex flex-col gap-5">
            <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3.5">
                <p className="text-[13px] text-red-700 leading-relaxed">
                    Deleting your account is permanent and cannot be undone. All your orders, returns,
                    and personal data will be removed. If you only want to stop marketing emails,
                    use the unsubscribe link in any email we've sent you.
                </p>
            </div>
            <div className="flex">
                <button className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50">
                    Delete my account
                </button>
            </div>
        </div>
    )
}