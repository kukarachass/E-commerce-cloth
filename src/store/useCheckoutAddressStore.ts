// store/useCheckoutStore.ts
import { create } from "zustand"
import {UpdateProfileCheckoutValues} from "@/lib/validators/update-profile-checkout-schema";
import {AddressSnapshot} from "@/types/IOrder";

interface CheckoutStore {
    contactData: UpdateProfileCheckoutValues | null
    addressData: AddressSnapshot | null;
    setAddressData: (data: AddressSnapshot) => void;
    setContactData: (data: UpdateProfileCheckoutValues) => void
    clear: () => void
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
    contactData: null,
    addressData: null,
    setAddressData: (data) => set({addressData: data}),
    setContactData: (data) => set({ contactData: data }),
    clear: () => set({ contactData: null }),
}))