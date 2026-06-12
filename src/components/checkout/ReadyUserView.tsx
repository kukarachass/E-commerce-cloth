"use client"

import { useEffect } from "react"
import { IUserWithDetails } from "@/types/user"
import { AddressSnapshot } from "@/types/IOrder"
import { useCheckout } from "@/store/useCheckout"
import { useRunCheckout } from "@/hooks/checkout/useRunCheckout"
import { CHECKOUT_MESSAGES } from "@/lib/checkout/messages"
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary"

interface Props {
    user: IUserWithDetails
    onEdit: () => void
}

export default function ReadyUserView({ user, onEdit }: Props) {
    const start = useCheckout((s) => s.start)
    const fail = useCheckout((s) => s.fail)
    const setSubmit = useCheckout((s) => s.setSubmit)
    const run = useRunCheckout()

    useEffect(() => {
        // нет адреса — оплачивать нечем по сохранённым данным
        if (!user.address) {
            setSubmit(null)
            return
        }

        setSubmit(() => {
            start()
            const address: AddressSnapshot = {
                street: user.address!.street,
                houseNumber: user.address!.houseNumber,
                houseAddition: user.address!.houseAddition ?? null,
                postcode: user.address!.postcode,
                city: user.address!.city,
                country: user.address!.country,
            }
            // email возьмётся из сессии на сервере → передавать не нужно
            run({ address }).catch(() => fail(CHECKOUT_MESSAGES.UNKNOWN))
        })

        return () => setSubmit(null)
    }, [user, start, fail, run, setSubmit])

    return (
        <div className="flex flex-col gap-4">
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
                        <span className="text-[var(--text)] capitalize text-[14px]">
                            {user.address?.street} {user.address?.houseNumber} {user.address?.houseAddition}
                        </span>
                        <span className="text-[var(--text)] text-[14px]">{user.address?.postcode}</span>
                        <span>{user.address?.country}</span>
                    </div>
                </div>
            </div>

            <ButtonPrimary variant="secondary" onClick={onEdit} className="max-w-[200px]">
                Edit details
            </ButtonPrimary>
        </div>
    )
}