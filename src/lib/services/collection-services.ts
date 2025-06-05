import { ApiBodyCollection, Collection } from "@/types";

async function getCollections(): Promise<Collection[]> {
  const res = await fetch("/api/strapi/collections?populate[0]=collection_icon,videos,articles,associated_conditions,sub_section,section&populate[1]=articles.thumbnail_icon,videos.thumbnail_icon,videos.quiz,section.associated_conditions,section.section_icon,videos.tips,videos.content_type,articles.content_type,videos.content,videos.source,videos.quiz, videos.tips, videos.content, articles.content,articles.quiz, articles.source,sub_section.section,sub_section.associated_conditions,sub_section.subsection_icon&populate[2]=videos.content.image,videos.content.video,articles.content.video,articles.content.image,articles.content.bg_image,articles.content.user_photo,articles.content.Quotes,articles.content.percentage_cards,sub_section.section.section_icon,sub_section.section.associated_conditions,videos.quiz.answers,articles.quiz.answers,videos.tips.tips_categories,articles.tips.tips_categories,videos.tips.associated_conditions,articles.tips.associated_conditions,videos.source.logo,articles.source.logo&populate[3]=videos.tips.tips_categories.icon,articles.tips.tips_categories.icon&pagination[pageSize]=500&pagination[page]=1");
  const json = await res.json();
  return json.data ?? [];
}

async function getSingleCollection(id: number): Promise<Collection> {
  const res = await fetch(`/api/strapi/collections/${id}?populate[0]=collection_icon,videos,articles,associated_conditions,sub_section,section&populate[1]=articles.thumbnail_icon,videos.thumbnail_icon,videos.quiz,section.associated_conditions,section.section_icon,videos.tips,videos.content_type,articles.content_type,videos.content,videos.source,videos.quiz, videos.tips, videos.content, articles.content,articles.quiz, articles.source,sub_section.section,sub_section.associated_conditions,sub_section.subsection_icon&populate[2]=videos.content.image,videos.content.video,articles.content.video,articles.content.image,articles.content.bg_image,articles.content.user_photo,articles.content.Quotes,articles.content.percentage_cards,sub_section.section.section_icon,sub_section.section.associated_conditions,videos.quiz.answers,articles.quiz.answers,videos.tips.tips_categories,articles.tips.tips_categories,videos.tips.associated_conditions,articles.tips.associated_conditions,videos.source.logo,articles.source.logo&populate[3]=videos.tips.tips_categories.icon,articles.tips.tips_categories.icon`);
  const collection = await res.json()
  return collection.data
}

async function PostCollection(data: ApiBodyCollection): Promise<Collection> {
  try {
    const response = await fetch(`/api/proxy/admin/cms/collections`,
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
    console.error("Failed to Add COllection:", err);
    throw err;
  }
}


async function UpdateCollection(data: ApiBodyCollection): Promise<Collection> {
  try {
    const response = await fetch(`/api/strapi/collections/${data.id}`,
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
    console.error("Failed to Add COllection:", err);
    throw err;
  }
}

async function UnpublishCollection(id: number) {
  try {
    const response = await fetch(
      `/api/strapi/collections/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          data: {
            publishedAt: null,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.error || `Error ${response.status}: ${response.statusText}`
      );
    }

    const json = await response.json();

    return json;
  } catch (err) {
    console.error("Failed to Delete Article:", err);
    throw err;
  }
}

async function DeleteCollection(id: number) {
  try {
    await UnpublishCollection(id);
    // After unpublishing, proceed to delete the collection
    const response = await fetch(`/api/proxy/admin/cms/collections/${id}`, {
      method: "DELETE",
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error ?? "Failed to Delete Collection.");
    }
    return json;
  } catch (err) {
    console.error("Delete collection failed:", err);
    throw err;
  }
}

export {
  getCollections,
  getSingleCollection,
  PostCollection,
  UpdateCollection,
  DeleteCollection
}