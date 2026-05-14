import Container from "@/components/layout/Сontainer";

interface Props {
    params: Promise<{ gender: string; slug: string }>
}

export default async function BrandPage({ params}: Props){
    const { gender, slug } = await params

    return(
        <Container>

        </Container>
    )
}