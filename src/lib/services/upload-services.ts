
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
        const json = await res.json();
        if (!res.ok) {
            throw new Error(json.error ?? "Failed to upload media file.");
        }

        return json
    } catch (er) {
        console.error(er);
        throw er
    }
}
