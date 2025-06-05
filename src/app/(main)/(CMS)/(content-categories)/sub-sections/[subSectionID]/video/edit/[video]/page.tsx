"use client";

import AddArticle from "@/components/cms/articles/add-edit-articles";
import MainLayout from "@/components/main-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SubSectionContext } from "@/context/sub-section-data-provider";
import { getSingleSubsection } from "@/lib/services/sub-section-service";
import { getSingleVideo } from "@/lib/services/video-services.";
import { Article, DetailedSubSection } from "@/types";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Page = ({
  params,
}: {
  params: Promise<{ subSectionID: string; video: string }>;
}) => {
  const [subSectionData, setSubSectionData] = useState<DetailedSubSection>();
  const [loading, setLoading] = useState<boolean>(true);
  const [articleData, setArticleData] = useState<Article>();
  const { subSections } = useContext(SubSectionContext);

  useEffect(() => {
    async function fetchSubSection() {
      const { subSectionID, video } = await params;
      let sub_section;
      sub_section = subSections.find((i) => i.id === Number(subSectionID));

      if (!sub_section) {
        sub_section = await getSingleSubsection(Number(subSectionID));
      }

      if (!sub_section) return redirect("/sub-sections");

      setSubSectionData(sub_section as DetailedSubSection);
      const articleData = await getSingleVideo(Number(video));

      if (!articleData) return redirect(`/sub-sections/${subSectionID}`);

      setArticleData(articleData);
      setLoading(false);
    }

    fetchSubSection();
  }, [params, subSections]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  } else if (subSectionData && articleData) {
    return (
      <MainLayout
        pageNavigation={[
          {
            link: "/sub-sections",
            text: "Sub Sections",
          },
          {
            text: "...",
            link: "",
          },
          {
            text: "Edit Video",
            link: "",
          },
        ]}
      >
        <AddArticle
          defaultData={{
            section: subSectionData.section?.id ?? null,
            sub_section: subSectionData.id ?? null, // Assuming sub_section corresponds to subSectionData.id
          }}
          editArticle={articleData}
          redirectTo={`/sub-sections/${subSectionData.id}`}
        />
      </MainLayout>
    );
  }
};
export default Page;
