"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import { Collection } from "@/types";
import { useDeferredValue, useState } from "react";
import Table from "./collections-table";
import DetailedMobilePreview from "@/components/mobile-preview";

export default function CollectionsMainPage() {
  const [_collections, setCollections] = useState<Collection[]>([]);
  const deferredQuery = useDeferredValue(_collections);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        <Table
          setCollections={setCollections}
          loading={loading}
          setLoading={setLoading}
        />
      </SidebarInset>
      <PreviewSidebar>
        <MobilePreview>
          <DetailedMobilePreview
            initialData={{
              collections: deferredQuery,
              sections: [],
            }}
            articles={[]}
            loading={loading}
          />
        </MobilePreview>
      </PreviewSidebar>
    </>
  );
}
