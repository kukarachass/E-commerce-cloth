import Image from "next/image";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";

export default function SuccessPage(){
    return(
        <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-row gap-8 py-10">
                <div className="flex flex-col gap-6 flex-1">
                    <h1 className="text-[var(--text)] font-medium text-[48px] leading-[133%]">Thank you, maksim!</h1>
                    <span className="text-[var(--text)] font-medium text-[20px] leading-[120%]">We're happy to see you've found some great style(s) at Otrium! Enjoy wearing your new outfit.</span>

                    <div className="flex flex-col gap-6 bg-[#f9f9f9] rounded-[10px] p-8">
                        <span className="text-[var(--text)] text-[16px] leading-[150%]">We've received your order. This is what we're going to do for you. So you can wear your new outfit very soon!</span>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-row gap-4 items-center">
                                <div className="bg-black rounded-full shrink-0 w-[32px] h-[32px] text-white text-center p-1 font-bold">1</div>
                                <div className="text-[var(--text)] text-[16px] leading-[150%]">
                                    We’ll send you a confirmation mail at <span className="font-bold">maksimvozniy18@gmail.com</span>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 items-center">
                                <div className="bg-black rounded-full shrink-0 w-[32px] h-[32px] text-white text-center p-1 font-bold">2</div>
                                <div className="text-[var(--text)] text-[16px] leading-[150%]">
                                    We’ll take care of your items and pack them with love. You’ll receive a tracking number when your order is on its way.
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 items-center">
                                <div className="bg-black rounded-full shrink-0 w-[32px] h-[32px] text-white text-center p-1 font-bold">3</div>
                                <div className="text-[var(--text)] text-[16px] leading-[150%]">
                                    Vrooomm, Your order will be with you soon! Please note, your order may be delivered in two separate packages.
                                </div>
                            </div>
                            <div className="text-[var(--text)] text-[16px] leading-[150%]">
                                When do I expect the delivery? <p className="font-bold">Shipping: 4-8 working days</p>
                            </div>
                        </div>
                    </div>

                    <ButtonPrimary className="max-w-[350px] w-full mx-auto" variant={"primary"}>
                        View order in My Account
                    </ButtonPrimary>
                </div>
                <div className="flex-1 relative min-h-[600px] h-full max-w-[480px]">
                    <Image src={"/success-img.jpg"} alt={"success"} fill className="object-cover rounded-[10px]"/>
                </div>
            </div>
        </div>

    )
}