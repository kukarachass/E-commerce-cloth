import Container from "@/components/layout/Сontainer";
import Image from "next/image";
import Link from "next/link";
import {useGenderStore} from "@/store/useGenderStore";

interface Props {
    bannerUrl: string;
    title: string;
    description: string;
    collectionLink: string;
}

export default function CollectionSection({bannerUrl, collectionLink, description, title}: Props){
    const gender = useGenderStore(s => s.gender);
    return(
        <Container>
            <div className="flex flex-row justify-between items-center w-full gap-8 py-10">
                <div className="relative w-1/2 aspect-[4/3] shrink-0">
                    <Image src={bannerUrl} alt={title} fill className="object-cover rounded-md"/>
                </div>
                <div className="flex flex-col items-center text-[var(--text)]">
                    <h1 className="font-bold text-[24px] leading-[125%]">{title}</h1>
                    <span className="text-[16px] leading-[150%]">{description}</span>
                    <Link href={`/${gender}/collections/${collectionLink}`} className="text-[16px] underline font-[600]">Shop now</Link>
                </div>
            </div>
        </Container>
    )
}