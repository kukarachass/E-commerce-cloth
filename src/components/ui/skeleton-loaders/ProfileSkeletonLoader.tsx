export default function ProfileSkeletonLoader() {
    return (
        <div className="max-w-[1200px] mx-auto py-10 px-4 flex flex-col gap-8">

            {/* Title: My Profile */}
            <div className="h-9 w-48 bg-[#f0f0f0] rounded animate-pulse mb-2" />

            {/* Section 1: Personal information */}
            <div className="flex flex-col gap-6">
                {/* Header of Section */}
                <div className="flex justify-between items-center pb-4 border-b border-[#ebebeb]">
                    <div className="h-6 w-44 bg-[#f0f0f0] rounded animate-pulse" />
                    <div className="h-4 w-4 bg-[#f0f0f0] rounded animate-pulse" /> {/* Chevron icon */}
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />

                    {/* Last Name */}
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />

                    {/* Email */}
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />

                    {/* Phone block (Country code + Number) */}
                    <div className="grid grid-cols-[100px_1fr] gap-4">
                        <div className="h-14 bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                        <div className="h-14 bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    </div>

                    {/* Date of birth */}
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />

                    {/* Gender */}
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                </div>

                {/* Address block grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Street */}
                    <div className="md:col-span-1 h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    {/* Number */}
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    {/* House addition */}
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                </div>

                {/* Postcode & City grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Postcode */}
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                    {/* City */}
                    <div className="h-14 w-full bg-[#f0f0f0] rounded-[10px] animate-pulse" />
                </div>

                {/* Save Changes Button */}
                <div className="mt-2 h-11 w-36 bg-[#f0f0f0] rounded-[10px] animate-pulse" />
            </div>

            {/* Section 2: Delete account */}
            <div className="flex flex-col gap-4 mt-4">
                {/* Header of Section */}
                <div className="flex justify-between items-center pb-4 border-b border-[#ebebeb]">
                    <div className="h-6 w-32 bg-[#f0f0f0] rounded animate-pulse" />
                    <div className="h-4 w-4 bg-[#f0f0f0] rounded animate-pulse" /> {/* Chevron icon */}
                </div>

                {/* Description text lines */}
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-2/3 bg-[#f0f0f0] rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-[#f0f0f0] rounded animate-pulse" />
                </div>
            </div>

        </div>
    )
}