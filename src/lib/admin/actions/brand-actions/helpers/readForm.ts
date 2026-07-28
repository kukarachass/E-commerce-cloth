export default function readForm(fd: FormData) {
    return {
        name: fd.get("name"),
        slug: fd.get("slug"),
        description: fd.get("description"),
        promoDetailsText: fd.get("promoDetailsText"),
        imageUrl: fd.get("imageUrl"),
        isActive: fd.get("isActive") === "on",
        tags: JSON.parse((fd.get("tags") as string) || "[]"),
    };
}