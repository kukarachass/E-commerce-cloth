"use client"

export default function BackButton() {
    return (
        <button
            onClick={() => history.back()}
            className="mt-6 text-[13px] text-gray-400 hover:text-black transition-colors duration-200 underline underline-offset-4 cursor-pointer"
        >
            ← Go back
        </button>
    )
}