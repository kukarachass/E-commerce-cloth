import LottieButton from "@/components/layout/header/action-buttons/LottieButton";
import accountJson from "@/components/layout/header/action-buttons/account.json";
import {useState} from "react";

export default function AccountLottie(){
    const [open, setOpen] = useState(false);
    return <LottieButton json={accountJson} onClick={() => setOpen(!open)}/>

}