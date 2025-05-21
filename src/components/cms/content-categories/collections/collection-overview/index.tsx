"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import { Article, Collection, Section, SubSection } from "@/types";
import { useState } from "react";
import Table from "./articles-table";
import DetailedMobilePreview from "@/components/cms/articles/mobile-preview";

export interface ArticleTableRow extends Article {
  section_data: Section | null;
  sub_section_data: SubSection | null;
  collection_data: Collection | null;
}
export default function CollectionDetailPage({
  collection,
}: {
  collection: Collection;
}) {
  const initialArticles = [...collection.articles, ...collection.videos].map(
    (i) => {
      const col = { ...collection, videos: [], articles: [] };
      i.collection = col;
      return i;
    }
  );
  const [_articles, setArticles] = useState<Article[]>(initialArticles);

  return (
    <>
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        <Table
          articles={initialArticles}
          setArticles={setArticles}
          collection={collection}
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
