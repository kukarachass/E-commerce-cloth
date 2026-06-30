"use client"

import AccordionSection from "@/components/account/my-profile/AccordionSection"
import PersonalInformationForm from "@/components/account/my-profile/PersonalInformation"
import DeleteAccountSection from "@/components/account/my-profile/DeleteAccountSection"
import { useGetUser } from "@/hooks/user/useGetUser"
import ProfileSkeletonLoader from "@/components/ui/skeleton-loaders/ProfileSkeletonLoader"

export default function MyProfilePage() {
    const { data: user, isPending } = useGetUser()

    if (isPending) return <ProfileSkeletonLoader />
    if (!user) return null

    return (
        <div className="flex flex-col gap-6 px-2 xl:px-0">
            <div>
                <h1 className="text-[20px] font-semibold text-neutral-900 tracking-tight">
                    My Profile
                </h1>
                <p className="text-[13px] text-neutral-400 mt-0.5">
                    Manage your personal information and account settings.
                </p>
            </div>

            <AccordionSection
                title="Personal information"
                description="Name, contact details and address"
            >
                <PersonalInformationForm user={user} />
            </AccordionSection>

            <AccordionSection
                title="Delete account"
                description="Permanently remove your account and data"
                defaultOpen={false}
            >
                <DeleteAccountSection />
            </AccordionSection>
        </div>
    )
}