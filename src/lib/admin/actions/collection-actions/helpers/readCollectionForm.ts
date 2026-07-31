export default function readCollectionForm(fd: FormData) {
    const str = (k: string) => {
        const v = fd.get(k);
        return v === null ? undefined : String(v);
    };

    return {
        title: str("title"),
        slug: str("slug"),
        description: str("description"),
        banner: str("banner"),
        gender: str("gender"),
        isActive: fd.get("isActive") === "on",
    };
}