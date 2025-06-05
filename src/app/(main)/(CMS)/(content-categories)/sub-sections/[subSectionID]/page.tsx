"use client";

import SubSectionDetailPage from "@/components/cms/content-categories/sub-sections/sub-section-overview";
import MainLayout from "@/components/main-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SubSectionContext } from "@/context/sub-section-data-provider";
import { getSingleSubsection } from "@/lib/services/sub-section-service";
import { DetailedSubSection } from "@/types";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Page = ({ params }: { params: Promise<{ subSectionID: string }> }) => {
  const [subSectionData, setSubSectionData] = useState<DetailedSubSection>();
  const { subSections } = useContext(SubSectionContext);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      const { subSectionID } = await params;
      let sub_section;
      sub_section = subSections.find((i) => i.id === Number(subSectionID));
      if (!sub_section) {
        sub_section = await getSingleSubsection(Number(subSectionID));
      }
      if (!sub_section) return redirect("/sub-sections");
      setLoading(false);
      setSubSectionData(sub_section as DetailedSubSection);
    }

    fetchData();
  }, [params, subSections]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  } else if (subSectionData) {
    return (
      <MainLayout
        pageNavigation={[
          {
            link: "/sub-sections",
            text: "Sub Sections",
          },
          {
            text: subSectionData.subsection_name,
            link: "",
          },
        ]}
      >
        <SubSectionDetailPage subSection={subSectionData} />
      </MainLayout>
    );
  }
};
export default Page;
