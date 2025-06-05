"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import {
  Article,
  Collection,
  ContentType,
  DetailedSection,
  Section,
  SubSection,
} from "@/types";
import { useMemo, useState } from "react";
import Table from "./articles-table";
import DetailedMobilePreview from "@/components/mobile-preview";

export interface ArticleTableRow extends Article {
  section_data?: Section;
  sub_section_data?: SubSection;
  collection_data?: Collection;
}
export default function SectionMainPage({
  section,
}: {
  section: DetailedSection;
}) {
  const initialArticles = useMemo(() => {
    const collectionArticles = section.collections.flatMap((collection) => {
      const baseCollection = {
        ...collection,
        section: {
          ...section,
          collections: [],
          sub_sections: [],
        },
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

    const subSectionArticles = section.sub_sections.flatMap((sub_section) => {
      return sub_section.collections.flatMap((collection) => {
        const baseCollection = {
          ...collection,
          sub_section: {
            ...sub_section,
            section: {
              ...section,
              collections: [],
              sub_sections: [],
            },
            collections: [],
          } as SubSection, // Include the full subSection object with collections
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
    });
    return [...collectionArticles, ...subSectionArticles].flatMap((i) => i);
  }, [section]);

  const [_articles, setArticles] = useState<Article[]>([]);

  return (
    <>
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        <Table initialArticles={initialArticles} setArticles={setArticles} />
      </SidebarInset>
      <PreviewSidebar>
        <MobilePreview>
          <DetailedMobilePreview articles={_articles} />
        </MobilePreview>
      </PreviewSidebar>
    </>
  );
}
