import { APIBodySection, Section } from "@/types";

async function getSections(): Promise<Section[]> {
    const res = await fetch("/api/strapi/sections?populate[0]=section_icon,collections,collections,sub_sections,associated_conditions&populate[1]=collections.videos,collections.articles,collections.collection_icon,section.section_icon,sub_sections.collections,sub_sections.subsection_icon&populate[2]=sub_sections.collections.videos,sub_sections.collections.articles,sub_sections.collections.collection_icon,collections.articles.source,collections.videos.source,collections.articles.content,collections.videos.tips,collections.videos.quiz,collections.articles.quiz,collections.articles.content_type,collections.articles.thumbnail_icon&populate[3]=sub_sections.collections.articles.source,sub_sections.collections.videos.source,collections.articles.source.logo,collections.videos.source.logo,sub_sections.collections.articles.content,sub_sections.collections.videos.tips,sub_sections.collections.videos.quiz,sub_sections.collections.articles.quiz,collections.videos.content.image,collections.videos.content.video,sub_sections.collections.articles.content_type,sub_sections.collections.articles.thumbnail_icon,collections.articles.content.image,collections.articles.content.video,collections.articles.content.bg_image,collections.articles.content.user_photo,collections.articles.content.Quotes,collections.articles.content.percentage_cards,collections.videos.quiz.answers,collections.articles.quiz.answers&populate[4]=sub_sections.collections.videos.source.logo,sub_sections.collections.articles.source.logo,sub_sections.collections.videos.content.image,sub_sections.collections.articles.content.video,sub_sections.collections.articles.content.image,sub_sections.collections.articles.content.video,collections.videos.tips.tips_categories,sub_sections.collections.videos.quiz.answers,sub_sections.collections.articles.quiz.answers,sub_sections.collections.articles.content.bg_image,sub_sections.collections.articles.content.Quotes,sub_sections.collections.articles.content.user_photo,sub_sections.collections.articles.content.percentage_cards&populate[5]=sub_sections.collections.videos.tips.tips_categories");
    const json = await res.json();
    return json ?? [];
}

async function getSingleSection(id: number): Promise<Section> {
    const res = await fetch(`/api/strapi/sections/${id}?populate[0]=section_icon,collections,collections,sub_sections,associated_conditions&populate[1]=collections.videos,collections.articles,collections.collection_icon,section.section_icon,sub_sections.collections,sub_sections.subsection_icon&populate[2]=sub_sections.collections.videos,sub_sections.collections.articles,sub_sections.collections.collection_icon,collections.articles.source,collections.videos.source,collections.articles.content,collections.videos.tips,collections.videos.quiz,collections.articles.quiz,collections.articles.content_type,collections.articles.thumbnail_icon&populate[3]=sub_sections.collections.articles.source,sub_sections.collections.videos.source,collections.articles.source.logo,collections.videos.source.logo,sub_sections.collections.articles.content,sub_sections.collections.videos.tips,sub_sections.collections.videos.quiz,sub_sections.collections.articles.quiz,collections.videos.content.image,collections.videos.content.video,sub_sections.collections.articles.content_type,sub_sections.collections.articles.thumbnail_icon,collections.articles.content.image,collections.articles.content.video,collections.articles.content.bg_image,collections.articles.content.user_photo,collections.articles.content.Quotes,collections.articles.content.percentage_cards,collections.videos.quiz.answers,collections.articles.quiz.answers&populate[4]=sub_sections.collections.videos.source.logo,sub_sections.collections.articles.source.logo,sub_sections.collections.videos.content.image,sub_sections.collections.articles.content.video,sub_sections.collections.articles.content.image,sub_sections.collections.articles.content.video,collections.videos.tips.tips_categories,sub_sections.collections.videos.quiz.answers,sub_sections.collections.articles.quiz.answers,sub_sections.collections.articles.content.bg_image,sub_sections.collections.articles.content.Quotes,sub_sections.collections.articles.content.user_photo,sub_sections.collections.articles.content.percentage_cards&populate[5]=sub_sections.collections.videos.tips.tips_categories`);
    const json = await res.json();
    return json.data
}


async function PostSection(data: APIBodySection): Promise<Section> {
    try {
        const response = await fetch(`/api/strapi/sections`,
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
        console.error("Failed to Add Section:", err);
        throw err;
    }
}


async function UpdateSection(data: APIBodySection): Promise<Section> {
    try {
        const response = await fetch(`/api/strapi/sections/${data.id}`,
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
        console.error("Failed to update Section:", err);
        throw err;
    }
}

async function DeleteSection(id: number) {
    try {
        const response = await fetch(`/api/strapi/sections/${id}`, {
            method: "DELETE",
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error("Failed to Delete section.");
        }

        return json;
    } catch (err) {
        console.error("Delete section failed:", err);
        throw err;
    }
}
export { getSections, getSingleSection, PostSection, UpdateSection, DeleteSection }