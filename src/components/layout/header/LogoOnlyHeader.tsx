import Link from "next/link";
import Image from "next/image";

export default function LogoOnlyHeader(){
    return(
        <header className="sticky top-0 bg-white z-50 border-b border-gray-200">
            <div className="max-w-[1200px] sticky top-0 mx-auto py-4 flex justify-center">
                <Link href="/">
                    <Image src="/logo.svg" alt="logo" width={100} height={24} />
                </Link>
            </div>
        </header>
    )
}