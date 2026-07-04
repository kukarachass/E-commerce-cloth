import CopySvg from "@/components/ui/icons/CopySvg";
import styles from "./banner-button.module.css"
import Link from "next/link";

interface Props {
    buttonUrl: string;
    buttonText: string;
}

export default function BannerButton({buttonUrl, buttonText}: Props) {

    return (
        <div className={`${styles["dashed-border"]} flex flex-row w-full max-w-[240px] rounded-[6px]`}>

            {/* 2. Заменяем w-[120px] на w-1/2 (50% ширины) */}
            <div className={`w-1/2 p-2 sm:p-3 flex flex-row items-center justify-center gap-1 sm:gap-2`}>
                {/* Убедитесь, что внутри CopySvg есть классы размеров, например className="w-4 h-4 shrink-0" */}
                <CopySvg/>
                <span className="text-white font-[600] text-[clamp(12px,4vw,16px)] leading-[150%] truncate">
                    {buttonText}
                </span>
            </div>

            {/* 3. Также ставим w-1/2. Добавил flex для идеального центрирования */}
            <Link
                href={buttonUrl}
                className="bg-white w-1/2 py-2 sm:py-3 px-2 sm:px-4 flex items-center justify-center cursor-pointer"
                /* 4. Заменили 15px на 15%, чтобы срез масштабировался вместе с кнопкой */
                style={{clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)"}}
            >
                <span className="text-[var(--text)] text-[clamp(12px,4vw,16px)] font-[600] leading-[150%] truncate">
                    Shop now
                </span>
            </Link>
        </div>
    )
}