import { APIBodySubSection, DetailedSubSection, SubSection } from "@/types";


async function getSubSections(): Promise<SubSection[]> {
    const res = await fetch("/api/strapi/sub-sections?populate[0]=subsection_name,subsection_icon,collections,section,associated_conditions&populate[1]=collections.videos,collections.articles,collections.collection_icon,section.section_icon&populate[2]=collections.videos.source,collections.articles.source,collections.videos.content,collections.articles.content,collections.videos.tips,collections.videos.quiz,collections.videos.tips,collections.articles.quiz,collections.articles.content_type,collections.videos.content_type,&populate[3]=collections.videos.source.logo,collections.articles.source.logo,collections.videos.content.image,collections.videos.content.video,collections.articles.content.bg_image,collections.articles.content.user_photo,collections.articles.content.Quotes,collections.articles.content.percentage_cards,collections.videos.quiz.answers,collections.articles.quiz.answers,collections.articles.thumbnail_icon,collections.articles.content.image,collections.articles.content.video,collections.videos.tips.tips_categories,collections.videos.quiz.answers,collections.articles.quiz.answers");
    const json = await res.json();
    return json.data ?? [];
}
async function getSingleSubsection(id: number | string): Promise<DetailedSubSection> {
    const res = await fetch(`/api/strapi/sub-sections/${id}?populate[0]=subsection_name,subsection_icon,collections,section,associated_conditions&populate[1]=collections.videos,collections.articles,collections.collection_icon,section.section_icon&populate[2]=collections.videos.source,collections.articles.source,collections.videos.content,collections.articles.content,collections.videos.tips,collections.videos.quiz,collections.videos.tips,collections.articles.quiz,collections.articles.content_type,collections.videos.content_type,&populate[3]=collections.videos.source.logo,collections.articles.source.logo,collections.videos.content.image,collections.videos.content.video,collections.articles.content.bg_image,collections.articles.content.user_photo,collections.articles.content.Quotes,collections.articles.content.percentage_cards,collections.videos.quiz.answers,collections.articles.quiz.answers,collections.articles.thumbnail_icon,collections.articles.content.image,collections.articles.content.video,collections.videos.tips.tips_categories,collections.videos.quiz.answers,collections.articles.quiz.answers`);
    const json = await res.json();
    return json.data;
}


async function PostSubSection(data: APIBodySubSection): Promise<SubSection> {
    try {
        const response = await fetch(`/api/strapi/sub-sections`,
            {
                method: "POST",
                body: JSON.stringify({
                    ...data
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: "Unknown error",
            }));

            const messageArray = errorData?.message;
            const message = Array.isArray(messageArray)
                ? messageArray.join(", ")
                : messageArray || errorData.error || `Error ${response.status}`;

            throw new Error(message);
        }

        const json = await response.json();

        return json.data;
    } catch (err) {
        console.error("Failed to Add Sub-section:", err);
        throw err;
    }
}


async function UpdateSubSection(data: APIBodySubSection): Promise<SubSection> {
    try {
        const response = await fetch(`/api/strapi/sub-sections/${data.id}`,
            {
                method: "PUT",
                body: JSON.stringify({
                    ...data
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: "Unknown error",
            }));

            const messageArray = errorData?.message;
            const message = Array.isArray(messageArray)
                ? messageArray.join(", ")
                : messageArray || errorData.error || `Error ${response.status}`;

            throw new Error(message);
        }

        const json = await response.json();

        return json.data;
    } catch (err) {
        console.error("Failed to update Sub-section:", err);
        throw err;
    }
}

async function DeleteSubsection(id: number) {
    try {
        const response = await fetch(`/api/strapi/sub-sections/${id}`, {
            method: "DELETE",
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error("Failed to Delete Subsection.");
        }

        return json;
    } catch (err) {
        console.error("Delete Subsection failed:", err);
        throw err;
    }
}

export {
    getSubSections,
    getSingleSubsection,
    PostSubSection,
    UpdateSubSection,
    DeleteSubsection
}