import { create } from "zustand"

type CheckoutStore = {
    isPending: boolean
    error: string | null
    submit: (() => void) | null            // регистрирует активный экран (форма / ready-view)
    setSubmit: (fn: (() => void) | null) => void
    start: () => void                      // начали: pending=true, error сбрасываем
    fail: (msg: string) => void            // ошибка: pending=false + текст
}

export const useCheckout = create<CheckoutStore>((set) => ({
    isPending: false,
    error: null,
    submit: null,
    setSubmit: (fn) => set({ submit: fn }),
    start: () => set({ isPending: true, error: null }),
    fail: (msg) => set({ isPending: false, error: msg }),
}))