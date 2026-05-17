import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";

export default function DeleteAccountSection() {
    return (
        <div className="flex flex-col gap-5">
            <p className="text-[15px] text-[#666] leading-relaxed max-w-[600px]">
                We&apos;re sorry to hear you&apos;d like to delete your account. If you simply wish to stop
                receiving marketing emails, you can do so by using the unsubscribe link in the latest
                email you received.
            </p>
            <ButtonPrimary variant="primary">
                Delete account
            </ButtonPrimary>
        </div>
    )
}