export default function NewsletterInput(){
    return(
        <div className="flex flex-col min-[880px]:flex-row gap-4 items-center">
            <input
                className={"w-[100%] min-[880px]:max-w-[400px] focus:outline-none py-[10px] px-4 bg-white rounded-lg"}
                placeholder={"Your email"}
                type="text"
            />
            <button className="border border-[#ccc] rounded-[24px] py-2 px-8 w-full min-[880px]:max-w-[120px]">
                <span className="text-nowrap text-white">Sign Up</span>
            </button>
        </div>
    )
}