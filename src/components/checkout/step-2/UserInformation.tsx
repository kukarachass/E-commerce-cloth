import {IUserWithDetails} from "@/types/user";
import ContactInformation from "@/components/checkout/ContactInfromation";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";

interface UserInformationProps{
    user: IUserWithDetails;
}

export default function UserInformation({ user } : UserInformationProps){

    return(
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
                <h2 className="text-[var(--text)] text-[24px] font-[600]">Contact Info</h2>
                <div className="flex flex-col gap-2">
                    <span className="text-[var(--text)] capitalize text-[14px]">{user.name} {user.lastName}</span>
                    <span className="text-[var(--text)] text-[14px]">{user.email}</span>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h2 className="text-[var(--text)] text-[24px] font-[600]">Shipping & billing address</h2>
                <div className="flex flex-col gap-2">
                    <span className="text-[var(--text)] capitalize text-[14px]">{user.address?.street} {user.address?.houseNumber} {user.address?.houseAddition}</span>
                    <span className="text-[var(--text)] text-[14px]">{user.address?.postcode}</span>
                    <span>{user.address?.country}</span>
                </div>
            </div>
        </div>
    )
}