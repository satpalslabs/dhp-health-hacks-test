import { Article } from "@/types";

export async function getVideos(): Promise<Article[]> {
  try {
    let articleCache: Article[] = [];
    let pageCount = 0;
    let totalCount = 1;

    while (pageCount < totalCount) {
      const res = await fetchVideos(pageCount + 1);
      totalCount = res.meta.pagination.pageCount;
      pageCount++;
      articleCache = [...articleCache, ...res.data];
    }

    return articleCache.map((i: Article) => ({
      ...i,
      content_type: {
        ...(i.content_type ? i.content_type : {}),
        id: i.content_type?.id ?? null,
        type: i.content_type?.type ?? "content-video",
      },
    }));
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}

const fetchVideos = async (page: number) => {
  try {
    const res = await fetch(
      `/api/proxy/admin/cms/videos?pageSize=100&page=${page}`
    );
    const json = await res.json();
    return json;
  } catch (error) {
    throw error;
  }
};

export async function getSingleVideo(id: number): Promise<Article> {
  try {
    const res = await fetch(
      `/api/strapi/videos/${id}?populate[0]=collection,tips,quiz,source,thumbnail_icon,subtitles&populate[1]=source.logo,subtitles.subtitle_file,quiz.answers,tips.tips_categories,collection.section,collection.sub_section&populate[2]=collection.sub_section.section`
    );
    const json = await res.json();
    const data = json.data;
    return data;
  } catch (err) {
    console.error("Error fetching article:", err);
    throw err;
  }
}

export async function DeleteVideo(id: number) {
  try {
    const response = await fetch(`/api/proxy/admin/cms/videos/${id}`, {
      method: "DELETE",
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error ?? "Failed to Delete article.");
    }

    return json;
  } catch (err) {
    console.error("Delete video failed:", err);
    throw err;
  }
}
