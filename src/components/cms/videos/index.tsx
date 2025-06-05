"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import ArticleMobilePreview from "@/components/mobile-preview";
import Table from "./videos-table";
import { Article } from "@/types";
import { useDeferredValue, useState } from "react";

export default function Videos() {
  const [videos, setVideos] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const deferredQuery = useDeferredValue(videos);

  return (
    <>
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        <Table
          setVideos={setVideos}
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
