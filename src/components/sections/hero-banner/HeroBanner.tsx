import Image from "next/image";
import BannerButton from "@/components/sections/hero-banner/banner-button/BannerButton";

interface HeroBannerProps {
    imageUrl: string;
    title: string;
    description: string;
    buttonUrl: string;
    buttonText: string;
}

export default function HeroBanner({imageUrl, title, description, buttonUrl, buttonText}: HeroBannerProps) {
    return (
        <>
            <div className="hidden min-[500px]:block relative w-full aspect-[16/7]">
                <Image
                    src={imageUrl}
                    alt="hero-banner"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="flex flex-col gap-4 absolute bottom-[32px] left-[32px]">
                    <div className="flex flex-col">
                        <h1 className="text-white md:text-[48px] text-[24px] font-[700]">{title}</h1>
                        <span
                            className="md:text-[16px] text-[12px] text-[#fff] leading-[150%] font-[400]">{description}</span>
                    </div>
                    <BannerButton buttonText={buttonText} buttonUrl={buttonUrl}/>
                </div>
            </div>
            <div className="flex flex-col min-[500px]:hidden w-full aspect-[16/7] max-h-[500px]">
                <Image
                    src={imageUrl}
                    alt="hero-banner"
                    width={500}
                    height={500}
                    className="object-cover"
                />
                <div className="flex flex-col gap-4 bg-black p-4 rounded-b">
                    <div className="flex flex-col">
                        <h1 className="text-white md:text-[48px] text-[24px] font-[700]">{title}</h1>
                        <span
                            className="md:text-[16px] text-[12px] text-[#fff] leading-[150%] font-[400]">{description}</span>
                    </div>
                    <BannerButton buttonText={buttonText} buttonUrl={buttonUrl}/>
                </div>
            </div>
        </>
    )
}