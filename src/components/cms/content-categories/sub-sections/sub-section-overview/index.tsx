"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import { Article, ContentType, DetailedSubSection } from "@/types";
import { useMemo, useState } from "react";
import Table from "./articles-table";
import DetailedMobilePreview from "@/components/cms/articles/mobile-preview";

export default function SubSectionDetailPage({
  subSection,
}: {
  subSection: DetailedSubSection;
}) {
  const initialArticles = useMemo(() => {
    return subSection.collections.flatMap((collection) => {
      const baseCollection = {
        ...collection,
        sub_section: { ...subSection, collections: [] }, // Include the full subSection object with collections
        videos: [],
        articles: [],
      };

      const articles = collection.articles.map((article) => ({
        ...article,
        collection: baseCollection,
        content_type: {
          ...article.content_type,
          type: article.content_type?.type ?? "content-page",
        } as ContentType,
      }));

      const videos = collection.videos.map((video) => ({
        ...video,
        collection: baseCollection,
        content_type: {
          ...(video.content_type ? video.content_type : {}),
          type: "content-video",
        } as ContentType,
      }));

      return [...articles, ...videos];
    });
  }, [subSection]);

  const [_articles, setArticles] = useState<Article[]>(initialArticles);
  return (
    <>
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        <Table
          articles={initialArticles}
          setArticles={setArticles}
          subsection={subSection}
        />
      </SidebarInset>
      <PreviewSidebar>
        <MobilePreview>
          <DetailedMobilePreview articles={_articles} />
        </MobilePreview>
      </PreviewSidebar>
    </>
  );
}
