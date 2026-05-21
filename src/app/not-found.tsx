import Link from "next/link"
import BackButton from "@/components/ui/buttons/BackButton";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gray-50 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gray-50 translate-x-1/4 translate-y-1/4" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gray-100" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-px bg-gray-100" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-[520px]">

                {/* 404 number */}
                <div className="relative mb-8">
                    <span
                        className="text-[180px] font-black leading-none tracking-tighter text-black select-none"
                        style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.05em" }}
                    >
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span
                            className="text-[180px] font-black leading-none tracking-tighter select-none"
                            style={{
                                fontFamily: "'Georgia', serif",
                                letterSpacing: "-0.05em",
                                WebkitTextStroke: "1px #e5e5e5",
                                color: "transparent",
                                transform: "translate(4px, 4px)",
                            }}
                        >
                            404
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-12 h-[2px] bg-black mb-8" />

                {/* Text */}
                <h1 className="text-[28px] font-bold text-black leading-tight mb-4 tracking-tight">
                    This page got marked down
                </h1>
                <p className="text-[16px] text-gray-500 leading-relaxed mb-10">
                    Looks like this page has sold out or never existed.
                    Let's get you back to the good stuff.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Link
                        href="/women"
                        className="flex-1 bg-black text-white text-[14px] font-semibold py-[14px] px-8 rounded-[8px] hover:bg-gray-900 transition-colors duration-200 text-center tracking-wide"
                    >
                        Shop Women
                    </Link>
                    <Link
                        href="/men"
                        className="flex-1 bg-white text-black text-[14px] font-semibold py-[14px] px-8 rounded-[8px] border border-black hover:bg-gray-50 transition-colors duration-200 text-center tracking-wide"
                    >
                        Shop Men
                    </Link>
                </div>

                {/* Back link */}
               <BackButton/>

            </div>

            {/* Bottom brand mark */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <span className="text-[11px] tracking-[0.2em] text-gray-300 uppercase font-medium">
                    Otrium
                </span>
            </div>

        </div>
    )
}