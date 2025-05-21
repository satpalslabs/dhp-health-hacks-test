"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import Table from "@/components/cms/content-categories/sections/sections-table";
import { DetailedSection } from "@/types";
import { useState } from "react";
import DetailedMobilePreview from "../../articles/mobile-preview";

export default function SectionsMainPage() {
  const [sections, setSections] = useState<DetailedSection[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        <Table
          setSections={setSections}
          loading={loading}
          setLoading={setLoading}
        />
      </SidebarInset>
      <PreviewSidebar>
        <MobilePreview>
          <DetailedMobilePreview
            initialData={{
              collections: [],
              sections: sections.filter(
                (i) => i.section_type == "health hacks"
              ),
            }}
            loading={loading}
            articles={[]}
          />
        </MobilePreview>
      </PreviewSidebar>
    </>
  );
}
