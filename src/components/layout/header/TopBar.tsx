"use client"

import {useState} from "react";
import Image from "next/image";


export default function TopBar() {
    const [promoOpen, setPromoOpen] = useState(true);
    const promoBlocks = [{text: "Fast shipping & easy returns"}, {text: "Premium brands"}, {text: "Always up to 75% off"}]


    return (
        <div className="w-full bg-black">
            <div className="max-w-[1232px] mx-auto p-3 text-white relative">
                {promoOpen ? (
                    <div className="flex flex-row gap-8 text-center justify-center items-center text-[14px]">
                    <span className="flex-1 text-center text-[clamp(13px,2vw,16px)]">
                        Use code WELCOME on your first order for free shipping on orders above £35
                    </span>
                        <button onClick={() => setPromoOpen(!promoOpen)}
                                className="shrink-0 pl-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12.3422 4.36879L11.4263 3.45288L7.79513 7.08405L4.16396 3.45288L3.24805 4.36879L6.87922 7.99996L3.24805 11.6311L4.16396 12.547L7.79513 8.91588L11.4263 12.547L12.3422 11.6311L8.71104 7.99996L12.3422 4.36879"
                                    fill="white"/>
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="flex justify-between w-full">
                            <div className="hidden min-[870px]:flex flex-row gap-6">
                                {promoBlocks.map((block) => (
                                    <div key={block.text} className="flex flex-row items-center gap-2">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.875 6.19237L5.20538 10.5L13.125 2.625" stroke="white"
                                                  strokeWidth="1.75"/>
                                        </svg>
                                        <span className="text-white text-[13px] font-bold">{block.text}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-row justify-between w-full min-[870px]:w-auto min-[870px]:flex-row gap-6 items-center">
                                <div className="flex pb-1">
                                    <Image src={"/trustpilot.svg"} alt={"trustpilot"} width={95} height={29}/>
                                </div>
                                <div className="hidden min-[870px]:flex flex-1 flex-row items-center justify-center gap-1">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.75977 12C3.75977 16.5478 7.45199 20.24 11.9998 20.24C16.5475 20.24 20.2398 16.5478 20.2398 12C20.2398 7.45223 16.5475 3.76001 11.9998 3.76001C7.45199 3.76001 3.75977 7.45223 3.75977 12V12" stroke="white" strokeWidth="1.52"/>
                                        <path d="M11.573 10.545C12.03 10.545 12.382 10.655 12.63 10.874C12.876 11.093 13 11.378 13 11.728C13 11.8 12.992 11.928 12.975 12.111C12.958 12.294 12.926 12.461 12.88 12.614L12.407 14.277C12.3651 14.4276 12.3304 14.5801 12.303 14.734C12.273 14.904 12.257 15.035 12.257 15.123C12.257 15.343 12.307 15.495 12.407 15.575C12.505 15.655 12.678 15.695 12.923 15.695C13.038 15.695 13.168 15.675 13.313 15.635C13.458 15.595 13.563 15.56 13.63 15.529L13.503 16.043C13.123 16.192 12.821 16.304 12.595 16.383C12.3406 16.4653 12.0743 16.5048 11.807 16.5C11.347 16.5 10.99 16.388 10.735 16.165C10.4859 15.9548 10.3457 15.6428 10.354 15.317C10.354 15.184 10.363 15.047 10.382 14.908C10.402 14.769 10.432 14.613 10.473 14.437L10.949 12.769C10.99 12.609 11.027 12.456 11.055 12.315C11.084 12.172 11.098 12.041 11.098 11.922C11.098 11.71 11.053 11.561 10.965 11.477C10.876 11.393 10.708 11.352 10.458 11.352C10.336 11.352 10.209 11.37 10.08 11.408C9.952 11.448 9.841 11.483 9.75 11.518L9.875 11.004C10.186 10.878 10.485 10.77 10.768 10.68C11.052 10.59 11.321 10.545 11.573 10.545V10.545M12.623 7.5C12.933 7.5 13.199 7.602 13.419 7.808C13.639 8.014 13.75 8.262 13.75 8.551C13.7532 8.834 13.6327 9.10429 13.42 9.291C13.2044 9.49302 12.9184 9.60282 12.623 9.597C12.313 9.597 12.047 9.495 11.824 9.291C11.604 9.088 11.492 8.84 11.492 8.551C11.492 8.262 11.604 8.014 11.824 7.808C12.047 7.602 12.314 7.5 12.624 7.5L12.623 7.5" fill="white"/>
                                    </svg>
                                    <span className="text-[14px] font-medium">Help centre</span>
                                </div>
                                <div className="flex flex-row items-center gap-1 ml-auto min-[870px]:ml-0">
                                    <Image src={"/language.svg"} alt={"language"} width={24} height={24}/>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 6.66656L11.06 5.72656L8 8.7799L4.94 5.72656L4 6.66656L8 10.6666L12 6.66656" fill="#999999"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}