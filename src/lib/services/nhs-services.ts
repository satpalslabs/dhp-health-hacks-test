import { NHSCondition } from "@/types";
import { NHSApiResponse } from "@/types/nhs-data";

export async function getNHSData(schemeID: string): Promise<NHSCondition[]> {
  const res = await fetch(`/api/proxy/app-data/schema/${schemeID}`);
  const response: NHSApiResponse[] = await res.json();
  let nhsData: NHSCondition[] = [];

  nhsData = response?.map((i: NHSApiResponse) => ({
    id: i.id,
    createdAt: i.createdAt,
    updatedAt: i.updatedAt,
    url: i.meta.data.url,
    name: i.meta.data.name,
    description: i.meta.data.description,
    articleStatus: i.meta.data.articleStatus as "published" | "draft" | "unpublished",
    genre: i.meta.data.mainEntityOfPage.genre,
  }));
  return nhsData;
}
