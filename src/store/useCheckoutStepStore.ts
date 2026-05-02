import {create} from "zustand/react";

interface CheckoutStepState {
    step: number;
    setStep: (step: number) => void;
}

export const useCheckoutStepStore = create<CheckoutStepState>()((set) => ({
    step: 1,
    setStep: (step) => set({ step: step }),
}))