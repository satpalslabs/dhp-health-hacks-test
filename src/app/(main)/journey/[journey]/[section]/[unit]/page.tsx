import JourneyPreviewSection from "@/components/journey/journey-preview";
import JourneySection from "@/components/journey/journey-sections/journey-unit/units-reorder";
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
  params: Promise<{ journey: string; section: string; unit: string }>;
}) {
  // Share blog slug to client component
  const { journey, section, unit } = await params;
  const allJourneys: JourneyData[] = await getJourneys();

  const journeyData: JourneyData | undefined = await getJourneyById(
    Number(journey)
  );

  const journeySection = journeyData?.sections.find(
    (i) => i.id == Number(section)
  );
  const journeyUnit = journeySection?.units.find((i) => i.id == Number(unit));
  // If no blog is found, return 404
  if (!journeyData || !journeySection) {
    redirect("/journey"); // This will trigger the 404 page
  } else {
    if (!journeyUnit) {
      redirect(`/journey/${journeyData.id}/${journeySection.id}`);
    }
  }
  return (
    <DataProvider value={allJourneys}>
      <MainLayout
        pageNavigation={[
          { text: "...", link: "" },
          {
            text: journeySection?.title,
            link: `/journey/${journey}/${section}`,
          },
        ]}
      >
        <SidebarInset className=" min-h-auto w-full overflow-x-hidden">
          <JourneySection
            sectionData={journeySection}
            journeyData={journeyData}
            unitData={journeyUnit}
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
