export default function readBrandForm(fd: FormData) {
    const str = (k: string) => {
        const v = fd.get(k);
        return v === null ? undefined : String(v);
    };

    return {
        name: str("name"),
        slug: str("slug"),
        description: str("description"),
        promoDetailsText: str("promoDetailsText"),
        imageUrl: str("imageUrl"),
        isActive: fd.get("isActive") === "on",
        tags: JSON.parse((fd.get("tags") as string) || "[]"),
    };
}
