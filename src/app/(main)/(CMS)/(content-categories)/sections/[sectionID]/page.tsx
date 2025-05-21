"use client";

import SectionMainPage from "@/components/cms/content-categories/sections/section-overview";
import MainLayout from "@/components/main-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SectionContext } from "@/context/section-data-provider";
import { getSingleSection } from "@/lib/services/section-service";
import { DetailedSection, Section } from "@/types";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Page = ({ params }: { params: Promise<{ sectionID: string }> }) => {
  const { sections } = useContext(SectionContext);
  const [sectionData, setSectionData] = useState<Section>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSection() {
      const { sectionID } = await params;
      let section;
      section = sections.find((i) => i.id === Number(sectionID));
      if (!section) {
        section = await getSingleSection(Number(sectionID));
      }
      if (!section) return redirect("/sections");
      setLoading(false);
      setSectionData(section);
    }

    fetchSection();
  }, [params, sections]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  } else if (sectionData) {
    return (
      <MainLayout
        pageNavigation={[
          {
            link: "/sections",
            text: "Sections",
          },
          {
            text: sectionData.section_name,
            link: "",
          },
        ]}
      >
        <SectionMainPage section={sectionData as unknown as DetailedSection} />
      </MainLayout>
    );
  }
};
export default Page;
