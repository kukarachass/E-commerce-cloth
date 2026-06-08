// store/useCheckoutStore.ts
import { create } from "zustand"
import {UpdateProfileCheckoutValues} from "@/lib/validators/update-profile-checkout-schema";

interface CheckoutStore {
    contactData: UpdateProfileCheckoutValues | null
    setContactData: (data: UpdateProfileCheckoutValues) => void
    clear: () => void
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
    contactData: null,
    setContactData: (data) => set({ contactData: data }),
    clear: () => set({ contactData: null }),
}))