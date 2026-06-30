import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import Link from "next/link";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import {useMobileMenuStore} from "@/store/adaptive/useMobileMenuStore";

interface MobileMenuActionsProps{
    onClose: () => void;
}

export default function MobileMenuActions({ onClose }: MobileMenuActionsProps) {
    const session = authClient.useSession();
    const router = useRouter();

    const handleLogout = async () => {
        onClose();
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth?method=sign-in"); // redirect to login page
                },
            },
        });
    }

    const handleRedirect = (href: string) => {
        onClose();
        router.push(href);
    }
    return (
        <>
            <div className="border-t border-gray-100">
                <Link
                    onClick={() => onClose()}
                    href="/account/my-profile"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
                            stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[15px] font-medium text-gray-900">My account</span>
                </Link>

                <Link
                    onClick={() => onClose()}
                    href="/customer-service"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M7 9H17M7 13H17M21 20L17.6757 18.3378C17.4237 18.2118 17.2977 18.1488 17.1656 18.1044C17.0484 18.065 16.9277 18.0365 16.8052 18.0193C16.6672 18 16.5263 18 16.2446 18H6.2C5.07989 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.0799 4 6.2 4H17.8C18.9201 4 19.4802 4 19.908 4.21799C20.2843 4.40973 20.5903 4.71569 20.782 5.09202C21 5.51984 21 6.0799 21 7.2V20Z"
                            stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[15px] font-medium text-gray-900">Customer service</span>
                </Link>
            </div>

            <div className="h-px bg-gray-100 my-1"/>

            {session ? (
                <div className="py-2">
                    <button
                        onClick={() => handleLogout()}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9"
                                stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-[14px] font-medium text-red-600">Sign out</span>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-2 p-4">
                    <ButtonPrimary onClick={() => handleRedirect("/auth?method=sign-in")} variant={"primary"}>
                        Sign In
                    </ButtonPrimary>
                    <ButtonPrimary onClick={() => handleRedirect("/auth?method=sign-up")} variant={"secondary"}>
                        Sign Up
                    </ButtonPrimary>
                </div>
            )}
        </>
    )
}