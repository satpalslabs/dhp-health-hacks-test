
export async function uploadFiles(files: File[]) {
    const formData = new FormData();
    // Append each file with key 'files'
    files.forEach((file) => {
        formData.append("files", file);
    });

    try {
        const res = await fetch(`/api/proxy/admin/cms/upload`, {
            method: "POST",
            body: formData,
        });
        return await res.json();
    } catch (er) {
        console.error(er);
        throw new Error("Error uploading files");
    }
}
