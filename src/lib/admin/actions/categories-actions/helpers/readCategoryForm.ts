export default function readCategoryForm(fd: FormData) {
    return {
        name: fd.get("name"),
        slug: fd.get("slug"),
        gender: fd.get("gender"),
        parentId: fd.get("parentId") ?? "",
        image: fd.get("image") ?? "",
    };
}