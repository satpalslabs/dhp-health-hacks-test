"use client";

import { useContext, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import JourneyUnitComponent from "@/components/cms/journey/journey-overview/journey-unit-view";
import JourneyPreviewSection from "@/components/cms/journey/journey-preview";
import MainLayout from "@/components/main-layout";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import { JourneyContext } from "@/context/journey-data-provider";
import { SidebarInset } from "@/components/ui/sidebar";
import { JourneyData, JourneySection, JourneyUnit } from "@/types";

export default function DetailJourneySection({
  params,
}: {
  params: Promise<{ journey: string; section: string; unit: string }>;
}) {
  const { journeys } = useContext(JourneyContext);
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  const [journeySection, setJourneySection] = useState<JourneySection | null>(
    null
  );
  const [journeyUnit, setJourneyUnit] = useState<JourneyUnit | null>(null);

  useEffect(() => {
    async function fetchJourney() {
      const { journey, section, unit } = await params;

      const foundJourney = journeys.find((j) => j.id === Number(journey));
      if (!foundJourney) return redirect("/journey");

      const foundSection = foundJourney.sections.find(
        (s) => s.id === Number(section)
      );
      if (!foundSection) return redirect("/journey");

      const foundUnit = foundSection.units.find((u) => u.id === Number(unit));
      if (!foundUnit)
        return redirect(`/journey/${foundJourney.id}/${foundSection.id}`);

      // Update states only once after all validations pass
      setJourneyData(foundJourney);
      setJourneySection(foundSection);
      setJourneyUnit(foundUnit);
    }

    fetchJourney();
  }, [params, journeys]);

  if (!journeyData || !journeySection || !journeyUnit) return null; // Prevents premature rendering

  return (
    <MainLayout
      pageNavigation={[
        {
          link: "/journey",
          text: "Journey",
        },
        { text: "...", link: "" },
        {
          text: journeySection.title,
          link: `/journey/${journeyData.id}/${journeySection.id}`,
        },
      ]}
    >
      <SidebarInset className="min-h-auto w-full overflow-x-hidden">
        <JourneyUnitComponent
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
  );
}
