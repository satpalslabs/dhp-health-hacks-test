"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import DetailedTable from "./table";
import Preview from "./preview";
import { NHSCondition } from "@/types";

const NHSMainPage = ({
  conditions,
  loading,
}: {
  conditions: NHSCondition[];
  loading: boolean;
}) => (
  <>
    <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
      <DetailedTable data={conditions} loading={loading} />
    </SidebarInset>
    <PreviewSidebar>
      <MobilePreview>
        <Preview data={conditions} loading={loading} />
      </MobilePreview>
    </PreviewSidebar>
  </>
);

export default NHSMainPage;
