import JourneyPreviewSection from "@/components/journey/journey-preview";
import JourneySections from "@/components/journey/journey-sections/journey-reorder";
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

export default async function DetailJourney({
  params,
}: {
  params: Promise<{ journey: string }>;
}) {
  // Share blog slug to client component
  const { journey } = await params;
  const allJourneys: JourneyData[] = await getJourneys();

  const journeyData: JourneyData | undefined = await getJourneyById(
    Number(journey)
  );

  // If no blog is found, return 404
  if (!journeyData) {
    redirect("/journey"); // This will trigger the 404 page
  }
  return (
    <DataProvider value={allJourneys}>
      <MainLayout pageTitle={[journeyData?.title]}>
        <SidebarInset className="p-6 min-h-auto w-full overflow-x-hidden">
          <JourneySections journeyData={journeyData} />
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
