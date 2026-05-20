import Image from "next/image";

export default function SocialsMethod(){
    return(
        <div className="flex flex-row gap-4 items-center w-full">
            <button className="group flex flex-row gap-2 items-center justify-center bg-black/4 rounded-[10px] cursor-pointer w-full py-2 px-8 transition-all duration-300 hover:bg-black hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                <Image src={"auth/google.svg"} alt={"google"} width={20} height={20} className="transition-all duration-300 group-hover:invert"/>
                <span className="text-[var(--text)] text-[16px] font-[600] transition-colors duration-300 group-hover:text-white">Google</span>
            </button>
            <button className="group flex flex-row gap-2 items-center justify-center bg-black/4 rounded-[10px] cursor-pointer w-full py-2 px-8 transition-all duration-300 hover:bg-black hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                <Image src={"auth/facebook.svg"} alt={"facebook"} width={20} height={20} className="transition-all duration-300 group-hover:invert"/>
                <span className="text-[var(--text)] text-[16px] font-[600] transition-colors duration-300 group-hover:text-white">Facebook</span>
            </button>
        </div>
    )
}