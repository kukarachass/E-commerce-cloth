import CopySvg from "@/components/ui/icons/CopySvg";
import styles from "./banner-button.module.css"
import Link from "next/link";

interface Props{
    buttonUrl: string;
    buttonText: string;
}

export default function BannerButton({ buttonUrl, buttonText } : Props){

    return(
        <div className={`${styles["dashed-border"]} flex flex-row w-fit rounded-[6px]`}>
            <div className={`w-[120px] p-3 flex flex-row items-center gap-2`}>
                <CopySvg/>
                <span className="text-white font-[600] text-[16px] leading-[150%]">{buttonText}</span>
            </div>

            <Link
                href={buttonUrl}
                className="bg-white w-[120px] py-3 px-4 text-center cursor-pointer"
                style={{ clipPath: "polygon(15px 0%, 100% 0%, 100% 100%, 0% 100%)" }}
            >
                <span className="text-[var(--text)] text-[16px] font-[600] leading-[150%]">Shop now</span>
            </Link>
        </div>
    )
}