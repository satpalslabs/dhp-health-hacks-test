import { ContentProvider } from "@/types";
let contentProviderCache: ContentProvider[] | null = null;

export async function getContentProviders(): Promise<ContentProvider[]> {
  if (contentProviderCache) return contentProviderCache;
  const res = await fetch("/api/proxy/admin/cms/content-providers");
  const json = await res.json();
  contentProviderCache = json.data;
  return contentProviderCache ?? [];
}
