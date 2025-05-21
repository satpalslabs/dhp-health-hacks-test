"use client";

import AddArticle from "@/components/cms/articles/add-edit-articles";
import MainLayout from "@/components/main-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SectionContext } from "@/context/section-data-provider";
import { getSingleSection } from "@/lib/services/section-service";
import { Section } from "@/types";
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
            text: "...",
            link: "",
          },
          {
            text: "Add new Article",
            link: "",
          },
        ]}
      >
        <AddArticle
          defaultData={{
            section: sectionData.id,
          }}
          redirectTo={`/sections/${sectionData.id}`}
        />
      </MainLayout>
    );
  }
};
export default Page;
