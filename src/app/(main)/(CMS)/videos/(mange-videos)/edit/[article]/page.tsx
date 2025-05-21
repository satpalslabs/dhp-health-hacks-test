"use client";

import AddArticle from "@/components/cms/articles/add-edit-articles";
import MainLayout from "@/components/main-layout";
import { ArticleContext } from "@/context/article-data-provider";
import { toast } from "@/hooks/use-toast";
import { getSingleVideo } from "@/lib/services/video-services.";
import { Article } from "@/types";
import { TriangleAlert } from "lucide-react";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Page = ({ params }: { params: Promise<{ article: string }> }) => {
  const { articles } = useContext(ArticleContext);

  const [articleData, setArticleData] = useState<Article>();
  useEffect(() => {
    fetchArticles();
  }, [params, articles]);

  async function fetchArticles() {
    try {
      const { article } = await params;
      let foundArticle = articles.find((i) => i.id === Number(article));
      if (!foundArticle) {
        foundArticle = await getSingleVideo(Number(article));
        if (!foundArticle) return redirect("/videos");
      }
      setArticleData(foundArticle);
    } catch (error) {
      console.error("Error fetching article:", error);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <TriangleAlert className="w-5 h-5 text-red-500" />
            <span>Error Data Fetching</span>
          </div>
        ) as unknown as string,
        description: `Unable to fetch article data. Please try again later.`,
        variant: "destructive",
        className: "border border-red-500 bg-red-50 text-red-900",
      });
      redirect("/articles");
    }
  }

  if (!articleData) return null; // Ensures component does not render prematurely

  return (
    <MainLayout
      pageNavigation={[
        {
          link: "/videos",
          text: "Videos",
        },
        {
          text: "Edit Video",
          link: "",
        },
      ]}
    >
      <AddArticle editArticle={articleData} redirectTo="/videos" />
    </MainLayout>
  );
};
export default Page;
