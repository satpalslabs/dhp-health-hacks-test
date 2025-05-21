import MainLayout from "@/components/main-layout";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import JourneyPreviewSection from "@/components/cms/journey/journey-preview";
import JourneyTable from "@/components/cms/journey";
import { SidebarInset } from "@/components/ui/sidebar";

export default async function Journey() {
  return (
    <MainLayout
      pageNavigation={[
        {
          link: "/journey",
          text: "Journey",
        },
      ]}
    >
      <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
        {/* List of journey data */}
        <JourneyTable />
      </SidebarInset>
      <PreviewSidebar>
        <MobilePreview>
          {/* Mobile Preview */}
          <JourneyPreviewSection activeData={undefined} activeStep={0} />
        </MobilePreview>
      </PreviewSidebar>
    </MainLayout>
  );
}
