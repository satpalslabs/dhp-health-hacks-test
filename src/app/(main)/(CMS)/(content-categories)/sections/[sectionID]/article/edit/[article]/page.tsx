"use client";

import AddArticle from "@/components/cms/articles/add-edit-articles";
import MainLayout from "@/components/main-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SectionContext } from "@/context/section-data-provider";
import { getSingleArticle } from "@/lib/services/article-services";
import { getSingleSection } from "@/lib/services/section-service";
import { Article, Section } from "@/types";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Page = ({
  params,
}: {
  params: Promise<{ article: string; sectionID: string }>;
}) => {
  const [articleData, setArticleData] = useState<Article>();
  const [loading, setLoading] = useState<boolean>(true);
  const [sectionData, setSectionData] = useState<Section>();
  const { sections } = useContext(SectionContext);

  useEffect(() => {
    async function fetchData() {
      const { sectionID, article } = await params;

      let section;
      section = sections.find((i) => i.id === Number(sectionID));

      if (!section) {
        section = await getSingleSection(Number(sectionID));
      }

      if (!section) return redirect("/sections");
      setSectionData(section);
      
      const _articleData = await getSingleArticle(Number(article));
      if (!_articleData) return redirect(`/sections/${sectionID}`);

      setLoading(false);
      setArticleData(_articleData);
    }
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  } else if (articleData && sectionData) {
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
            text: "Edit Article",
            link: "",
          },
        ]}
      >
        <AddArticle
          editArticle={articleData}
          redirectTo={`/sections/${sectionData.id}`}
        />
      </MainLayout>
    );
  }
};
export default Page;
