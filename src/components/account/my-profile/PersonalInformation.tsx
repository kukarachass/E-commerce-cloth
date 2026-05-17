"use client"


import {useState} from "react";
import FloatingLabelInput from "@/components/ui/inputs/FloatingLabelInput";
import PhoneInput from "@/components/ui/inputs/PhoneInput";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import DateInput from "@/components/account/my-profile/DateInput";
import GenderSelect from "@/components/account/my-profile/GenderSelect";

export default function PersonalInformationForm() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [gender, setGender] = useState("")
    const [dob, setDob] = useState("")
    const [street, setStreet] = useState("")
    const [number, setNumber] = useState("")
    const [houseAddition, setHouseAddition] = useState("")
    const [postcode, setPostcode] = useState("")
    const [city, setCity] = useState("")

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingLabelInput label="First Name *" value={firstName} onChange={setFirstName} />
                <FloatingLabelInput label="Last name *" value={lastName} onChange={setLastName} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingLabelInput label="Email *" value={email} onChange={setEmail} />
                <div className="flex gap-3">
                    <PhoneInput />
                    <FloatingLabelInput label="Phone number" value="" onChange={() => {}} className="flex-1" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateInput value={dob} onChange={setDob} />
                <GenderSelect value={gender} onChange={setGender} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FloatingLabelInput label="Street *" value={street} onChange={setStreet} className="col-span-2 md:col-span-1" />
                <FloatingLabelInput label="Number *" value={number} onChange={setNumber} />
                <FloatingLabelInput label="House addition" value={houseAddition} onChange={setHouseAddition} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingLabelInput label="Postcode *" value={postcode} onChange={setPostcode} />
                <FloatingLabelInput label="City *" value={city} onChange={setCity} />
            </div>

            <div className="pt-2">
                <ButtonPrimary variant="primary">
                    Save Changes
                </ButtonPrimary>
            </div>
        </div>
    )
}
