import MainLayout from "@/components/main-layout";
import { SidebarInset } from "@/components/ui/sidebar";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import { getJourneys, JourneyData } from "@/lib/journey-services";
import JourneyTable from "@/components/journey/journey-table";
import JourneyPreviewSection from "@/components/journey/journey-preview";
import DataProvider from "@/components/providers/data-provider";

export default async function Journey() {
  const journeyData: JourneyData[] = await getJourneys();
  return (
    <DataProvider value={journeyData}>
      <MainLayout pageNavigation={null}>
        <SidebarInset className="p-6 min-h-auto w-full overflow-hidden">
          <JourneyTable />
        </SidebarInset>
        <PreviewSidebar>
          <MobilePreview>
            <JourneyPreviewSection activeData={undefined} activeStep={0} />
          </MobilePreview>
        </PreviewSidebar>
      </MainLayout>
    </DataProvider>
  );
}
