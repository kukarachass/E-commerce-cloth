export default function RouteLoadingScreen() {
    return (
        <div className="fixed inset-0 z-[200] bg-white flex items-center justify-center">
            <div className="relative font-[var(--font-cormorant)] text-[40px] font-semibold tracking-wide">
                <span className="text-neutral-200">Otrium</span>
                <span
                    className="absolute inset-0 text-neutral-900"
                    style={{
                        clipPath: "inset(0 100% 0 0)",
                        animation: "logo-wipe 1.1s cubic-bezier(0.65, 0, 0.35, 1) infinite",
                    }}
                >
                    Otrium
                </span>
            </div>
        </div>
    )
}