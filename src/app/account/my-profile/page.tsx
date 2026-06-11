"use client"

import AccordionSection from "@/components/account/my-profile/AccordionSection";
import PersonalInformationForm from "@/components/account/my-profile/PersonalInformation";
import DeleteAccountSection from "@/components/account/my-profile/DeleteAccountSection";
import {useGetUser} from "@/hooks/user/useGetUser";
import ProfileSkeletonLoader from "@/components/ui/skeleton-loaders/ProfileSkeletonLoader";

export default function MyProfilePage() {
    const { data: user, isPending } = useGetUser();
    if (isPending) return <ProfileSkeletonLoader/>;
    if(!user) return null;

    return (
        <div className="flex flex-col max-w-[900px] w-full">
            <h1 className="text-[28px] font-bold text-[var(--text)] pb-6">My Profile</h1>

            <AccordionSection title="Personal information">
                <PersonalInformationForm user={user} />
            </AccordionSection>

            <AccordionSection title="Delete account">
                <DeleteAccountSection />
            </AccordionSection>
        </div>
    )
}