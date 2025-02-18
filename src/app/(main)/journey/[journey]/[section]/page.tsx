import JourneyPreviewSection from "@/components/journey/journey-preview";
import JourneySection from "@/components/journey/journey-sections/journey-section/units-reorder";
import MainLayout from "@/components/main-layout";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import DataProvider from "@/components/providers/data-provider";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  getJourneyById,
  getJourneys,
  JourneyData,
} from "@/lib/journey-services";
import { redirect } from "next/navigation";

export default async function DetailJourneySection({
  params,
}: {
  params: Promise<{ journey: string; section: string }>;
}) {
  // Share blog slug to client component
  const { journey, section } = await params;
  const allJourneys: JourneyData[] = await getJourneys();

  const journeyData: JourneyData | undefined = await getJourneyById(
    Number(journey)
  );

  const journeySection = journeyData?.sections.find(
    (i) => i.id == Number(section)
  );
  // If no blog is found, return 404
  if (!journeyData || !journeySection) {
    redirect("/journey"); // This will trigger the 404 page
  }
  return (
    <DataProvider value={allJourneys}>
      <MainLayout pageTitle={["...", journeySection?.title]}>
        <SidebarInset className="p-6 min-h-auto w-full overflow-x-hidden">
          <JourneySection
            sectionData={journeySection}
            journeyData={journeyData}
          />
        </SidebarInset>
        <PreviewSidebar>
          <MobilePreview>
            <JourneyPreviewSection
              activeData={{
                journey: journeyData,
                section: undefined,
              }}
              activeStep={1}
            />
          </MobilePreview>
        </PreviewSidebar>
      </MainLayout>
    </DataProvider>
  );
}
