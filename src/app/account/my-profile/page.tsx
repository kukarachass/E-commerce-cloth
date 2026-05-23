"use client"

import AccordionSection from "@/components/account/my-profile/AccordionSection";
import PersonalInformationForm from "@/components/account/my-profile/PersonalInformation";
import DeleteAccountSection from "@/components/account/my-profile/DeleteAccountSection";
import {authClient} from "@/lib/auth-client";
import {toUserDTO} from "@/lib/mappers/user.mapper";

export default function MyProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    if (isPending) return <div>Loading...</div>;
    if(!session) return null;

    const user = toUserDTO(session.user);

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