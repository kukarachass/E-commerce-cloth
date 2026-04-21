import NewsletterInput from "@/components/layout/footer/NewsletterInput";
import Image from "next/image";

export default function Footer() {
    const advantages = [
        {text: "Shipping: 4-7 working days"},
        {text: "Easy returns"},
        {text: "Premium brands"},
    ]

    const footer = [
        {
            title: "Otrium",
            text: ["About us", "All brands", "Blog", "Careers", "Partnership", "Press room", "Certified B Corporation", "Ethical Governance", "Ethical impact"]
        },
        {
            title: "My Account",
            text: ["My orders", "Create a Return", "My profile", "Favourites"]
        },
        {
            title: "Customer Service",
            text: ["Delivery", "Returns", "Payment information", "Help centre"]
        }
    ]
    return (
        <footer className="flex flex-col mt-auto w-full">
            <div className="bg-[var(--footer-top-bg)]">
                <div className="flex flex-col max-w-[1200px] w-full mx-auto">
                    <div className="flex flex-row justify-between py-8">
                        <div className="flex flex-col">
                            <h1 className="text-white font-bold text-[clamp(22px,2vw,24px)]">Subscribe to Our
                                Newsletter</h1>
                            <span className="text-[var(--header-muted)] text-[16px]">Get the newest discounts, brands, and drops.</span>
                        </div>
                        <NewsletterInput/>
                    </div>
                    <div className="flex justify-around border-y border-[#333] py-6">
                        <Image src={"footer/visa.svg"} alt={"visa"} width={96} height={40}/>
                        <Image src={"footer/mastercard.svg"} alt={"mastercard"} width={96} height={40}/>
                    </div>
                    <div className="flex flex-row justify-between items-center py-2">
                        {advantages.map((adv) => (
                            <div key={adv.text} className="flex flex-row gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_36_3482)">
                                        <path d="M1.5 10.6155L8.9235 18L22.5 4.5" stroke="#BEAB89" strokeWidth="3"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_36_3482">
                                            <rect width="24" height="24" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span
                                    className="text-[var(--header-muted)] leading-[188%] text-[16px]">{adv.text}</span>
                            </div>
                        ))}

                        <Image src={"trustpilot.svg"} alt={"trustpilot"} width={96} height={40}/>
                        <Image className="fill-white" src={"footer/certified.svg"} alt={"certified"} width={70} height={100}/>

                    </div>
                </div>
            </div>
            <div
                className="flex flex-col bg-[var(--footer-bottom-bg)] pt-[clamp(30px,2vw,60px)] pb-[clamp(16px,2vw,32px)]">
                <div
                    className="flex flex-row justify-between w-full max-w-[1200px] mx-auto border-b border-[#333] pb-8">
                    {footer.map((section) => (
                        <div key={section.title} className="flex flex-col gap-3">
                            <h3 className="text-white text-[clamp(18px,2vw,24px)] mb-2">{section.title}</h3>
                            {section.text.map((item) => (
                                <span key={item}
                                      className="text-[var(--header-muted)] text-[16px] leading-[150%] cursor-pointer hover:text-white transition-colors">
                                        {item}
                                    </span>
                            ))}
                        </div>
                    ))}

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[24px] leading-[133%] text-white">Download the app</h3>
                            <div className="flex flex-row gap-4">
                                <div className="bg-[#1d1e20] rounded-[24px] py-2 px-[60px] flex items-center">
                                    <Image src={"footer/apple.svg"} alt={"apple"} width={26} height={32}/>
                                </div>
                                <div className="bg-[#1d1e20] rounded-[24px] py-2 px-[60px] flex items-center">
                                    <Image src={"footer/android.svg"} alt={"apple"} width={26} height={32}/>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[24px] leading-[133%] text-white">Follow Us</h3>
                            <div className="flex flex-row gap-4">
                                <div className="bg-[#1d1e20] rounded-[24px] py-2 px-[60px] flex items-center">
                                    <Image src={"footer/tiktok.svg"} alt={"apple"} width={26} height={32}/>
                                </div>
                                <div className="bg-[#1d1e20] rounded-[24px] py-2 px-[60px] flex items-center">
                                    <Image src={"footer/insta.svg"} alt={"apple"} width={26} height={32}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto w-full">
                    <div className="flex justify-between w-full pt-4">
                        <div className="flex flex-row gap-2">
                            <Image src={"footer/otrium.svg"} alt={"otrium"} width={16} height={16}/>
                            <span className="text-[#999] text-[13px]">© 2016-2026 Otrium, except certain content provided by third parties</span>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <span className="text-[#999] text-[13px] leading-[143%]">Accessibility Statement</span>
                            <div className="w-[3px] h-[3px] bg-[#999]"/>
                            <span className="text-[#999] text-[13px] leading-[143%]">Privacy and cookie statement</span>
                            <div className="w-[3px] h-[3px] bg-[#999]"/>
                            <span className="text-[#999] text-[13px] leading-[143%]">Terms & Conditions</span>
                        </div>

                        <div className="flex flex-row gap-1 items-center">
                            <Image src={"language.svg"} alt={"language"} width={20} height={20}/>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 6.66656L11.06 5.72656L8 8.7799L4.94 5.72656L4 6.66656L8 10.6666L12 6.66656Z" fill="#999999" />
                            </svg>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    )
}