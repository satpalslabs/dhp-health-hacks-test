import { Article, FormBodyArticle } from "@/types";

async function getArticles(): Promise<Article[]> {
  try {
    let articleCache: Article[] = [];
    let pageCount = 0;
    let totalCount = 1;

    while (pageCount < totalCount) {
      const res = await fetchArticles(pageCount + 1);
      totalCount = res.meta.pagination.pageCount;
      pageCount++;
      articleCache = [...articleCache, ...res.data];
    }

    return articleCache.map((i: Article) => ({
      ...i,
      content_type: {
        ...(i.content_type ? i.content_type : {}),
        id: i.content_type?.id ?? null,
        type: i.content_type?.type ?? "content-page",
      },
    }));
  } catch (error) {
    console.error("Error fetching page:", error);
    throw error;
  }
}

const fetchArticles = async (page: number) => {
  try {
    const res = await fetch(
      `/api/strapi/articles?populate[0]=collection,quiz,source,content_type,content,thumbnail_icon&populate[1]=collection.collection_icon,collection.sub_section,quiz.answers,source.logo,content.image,content.video,content.image,content.icon,content.user_photo,content.reviews,content.percentage_cards,content.Quotes,content.bg_image&populate[2]=collection.sub_section.section,collection.sub_section.subsection_icon,collection.section.section_icon,content.reviews.user_photo,content.percentage_cards.icon&populate[3]=collection.sub_section.section.section_icon&pagination[pageSize]=100&pagination[page]=${page}`
    );
    const json = await res.json();
    return json;
  } catch (error) {
    throw error;
  }
};

async function getSingleArticle(id: number): Promise<Article> {
  try {
    const res = await fetch(
      `/api/strapi/articles/${id}?populate[0]=quiz,source,content_type,content,thumbnail_icon,collection&populate[1]=source.logo,quiz.answers,content.image,content.video,content.image,collection.section,collection.sub_section,content.icon,content.user_photo,content.reviews,content.percentage_cards,content.Quotes,content.bg_image,content.user_photo&populate[2]=content.reviews.user_photo,collection.sub_section.section,content.percentage_cards.icon`
    );
    const json = await res.json();
    const data = json.data;
    return data;
  } catch (err) {
    console.error("Error fetching article:", err);
    throw err;
  }
}

async function PostArticle(data: FormBodyArticle): Promise<Article[]> {


  try {
    const response = await fetch(
      data.content_type == "content-video"
        ? `/api/proxy/admin/cms/videos`
        : `/api/proxy/admin/cms/articles`,
      {
        method: "POST",
        body: data.content_type == "content-video" ? JSON.stringify(updatedData(data)) : JSON.stringify({
          data: updatedData(data)
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
        (Array.isArray(errorData.message) ? errorData.message.join(", ") : errorData.error || errorData.message) ||
        `Error ${response.status}: ${response.statusText}`
      );
    }

    const json = await response.json();

    return json;
  } catch (err) {
    console.error("Failed to Add Article:", err);
    throw err;
  }
}

async function PutArticle(data: FormBodyArticle): Promise<Article[]> {
  try {
    const response = await fetch(
      data.content_type == "content-video"
        ? `/api/strapi/videos/${data.id}`
        : `/api/proxy/admin/cms/articles/${data.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          data: updatedData(data),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();

    if (!response.ok) {
      if (!response.ok) {
        throw new Error(json.error ?? "Failed to Update article.");
      }
    }
    return json;
  } catch (err) {
    console.error("Failed to Add Article:", err);
    throw err;
  }
}

async function UnpublishArticle(type: "video" | "article", id: number) {
  try {
    const response = await fetch(
      type == "video"
        ? `/api/strapi/videos/${id}`
        : `/api/strapi/articles/${id}`,
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
async function changeStatusOfArticleOrVideo(type: "video" | "article", id: number, status: Article["status"]) {
  try {
    const response = await fetch(
      type == "video"
        ? `/api/strapi/videos/${id}`
        : `/api/strapi/articles/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          data: {
            status,
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
    console.error("Failed to Update status", err);
    throw err;
  }
}

async function DeleteArticle(id: number) {
  try {
    await UnpublishArticle("article", id);
    const response = await fetch(`/api/proxy/admin/cms/articles/${id}`, {
      method: "DELETE",
    });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error ?? "Failed to Delete article.");
    }

    return json;
  } catch (err) {
    console.error("Delete article failed:", err);
    throw err;
  }
}

async function getAppData(id: string) {
  try {
    const response = await fetch(`/api/proxy/app-data/${id}`);

    const json = await response.json();

    if (!response.ok) {
      throw new Error("Failed to get article Data.");
    }

    return json;
  } catch (err) {
    console.error("Failed to get article Data:", err);
    throw err;
  }
}

function updatedData(data: FormBodyArticle) {
  if (!data.source) {
    throw new Error("Source is required.");
  }
  if (!data.collection || !data.content_type) {
    throw new Error("Collection and content type are required.");
  }
  if (!data.title || !data.content) {
    throw new Error("Title and content are required.");
  }
  if (!data.content_type) {
    throw new Error("Content type is required.");
  }

  return {
    ...data,
    collection: [data.collection],
    source: data.source ? [data.source] : null,
    content_type:
      data.content_type == "content-page"
        ? [1]
        : data.content_type == "content-webpage"
          ? [5]
          : data.content_type == "content-video"
            ? [2]
            : null,
    key_points: data.content_type == "content-video" ? data.key_points ?? "" : undefined,
    summery: ""
  };
};

export {
  getArticles,
  getSingleArticle,
  PostArticle,
  PutArticle,
  UnpublishArticle,
  DeleteArticle,
  getAppData,
  changeStatusOfArticleOrVideo
};
