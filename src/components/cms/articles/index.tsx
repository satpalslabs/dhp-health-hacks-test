"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import ArticleMobilePreview from "@/components/mobile-preview";
import Table from "@/components/cms/articles/article-table";
import { Article } from "@/types";
import { useDeferredValue, useState } from "react";

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const deferredQuery = useDeferredValue(articles);

  return (
    <>
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        <Table
          setArticles={setArticles}
          loading={loading}
          setLoading={setLoading}
        />
      </SidebarInset>
      <PreviewSidebar>
        <MobilePreview>
          <ArticleMobilePreview
            articles={[...deferredQuery]}
            loading={loading}
          />
        </MobilePreview>
      </PreviewSidebar>
    </>
  );
}
