import AccordionSection from "@/components/account/my-profile/AccordionSection";
import PersonalInformationForm from "@/components/account/my-profile/PersonalInformation";
import DeleteAccountSection from "@/components/account/my-profile/DeleteAccountSection";

export default function MyProfilePage() {
    return (
        <div className="flex flex-col max-w-[900px] w-full">
            <h1 className="text-[28px] font-bold text-[var(--text)] pb-6">My Profile</h1>

            <AccordionSection title="Personal information">
                <PersonalInformationForm />
            </AccordionSection>

            <AccordionSection title="Delete account">
                <DeleteAccountSection />
            </AccordionSection>
        </div>
    )
}