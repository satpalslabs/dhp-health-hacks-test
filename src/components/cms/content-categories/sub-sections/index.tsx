"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import Table from "@/components/cms/content-categories/sub-sections/sub-sections-table";
import { DetailedSubSection } from "@/types";
import { useState } from "react";
import DetailedMobilePreview from "@/components/mobile-preview";

export default function SubSectionsMainPage() {
  const [_subSections, setSubSections] = useState<DetailedSubSection[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        <Table
          setSubSections={setSubSections}
          loading={loading}
          setLoading={setLoading}
        />
      </SidebarInset>
      <PreviewSidebar>
        <MobilePreview>
          <DetailedMobilePreview
            initialData={{
              collections: [],
              sections: [],
              sub_sections: _subSections,
            }}
            loading={loading}
            articles={[]}
          />
        </MobilePreview>
      </PreviewSidebar>
    </>
  );
}
