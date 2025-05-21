"use client";

import { useContext, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import JourneySections from "@/components/cms/journey/journey-overview";
import JourneyPreviewSection from "@/components/cms/journey/journey-preview";
import MainLayout from "@/components/main-layout";
import MobilePreview from "@/components/mobile-preview-sidebar/mobile";
import { PreviewSidebar } from "@/components/mobile-preview-sidebar/preview-sidebar";
import { JourneyContext } from "@/context/journey-data-provider";
import { SidebarInset } from "@/components/ui/sidebar";
import { JourneyData, JourneySection } from "@/types";

export default function DetailJourney({
  params,
}: {
  params: Promise<{ journey: string; section?: string }>;
}) {
  const { journeys } = useContext(JourneyContext);
  const [journeyData, setJourneyData] = useState<JourneyData>();
  const [journeySection, setJourneySection] = useState<JourneySection>();

  useEffect(() => {
    async function fetchJourney() {
      const { journey, section } = await params;

      const foundJourney = journeys.find((i) => i.id === Number(journey));
      if (!foundJourney) return redirect("/journey");

      setJourneyData(foundJourney);

      if (section) {
        const foundSection = foundJourney.sections.find(
          (i) => i.id === Number(section)
        );
        if (!foundSection) return redirect("/journey");
        setJourneySection(foundSection);
      }
    }

    fetchJourney();
  }, [params, journeys]);

  if (!journeyData) return null; // Ensures component does not render prematurely

  return (
    <MainLayout
      pageNavigation={[
        {
          link: "/journey",
          text: "Journey",
        },
        { text: journeyData.title, link: "" },
      ]}
    >
      <SidebarInset className="p-6 min-h-auto w-full overflow-x-hidden">
        <JourneySections journeyData={journeyData} section={journeySection} />
      </SidebarInset>
      <PreviewSidebar>
        <MobilePreview>
          <JourneyPreviewSection
            activeData={{
              journey: journeyData,
              section: journeySection,
            }}
            activeStep={1}
          />
        </MobilePreview>
      </PreviewSidebar>
    </MainLayout>
  );
}
