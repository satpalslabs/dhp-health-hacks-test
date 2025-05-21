"use client";

import AddArticle from "@/components/cms/articles/add-edit-articles";
import MainLayout from "@/components/main-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CollectionContext } from "@/context/collection-data-provider";
import { getSingleArticle } from "@/lib/services/article-services";
import { getSingleCollection } from "@/lib/services/collection-services";
import { Article, Collection } from "@/types";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Page = ({
  params,
}: {
  params: Promise<{ article: string; collectionID: string }>;
}) => {
  const [articleData, setArticleData] = useState<Article>();
  const [collectionData, setCollectionData] = useState<Collection>();
  const [loading, setLoading] = useState<boolean>(true);
  const { collections } = useContext(CollectionContext);

  useEffect(() => {
    async function fetchData() {
      const { collectionID, article } = await params;

      let collection;
      collection = collections.find((i) => i.id === Number(collectionID));

      if (!collection) {
        collection = await getSingleCollection(Number(collectionID));
      }

      if (!collection) return redirect("/collections");

      setCollectionData(collection);

      const articleData = await getSingleArticle(Number(article));
      if (!articleData) return redirect(`/collections/${collectionID}`);
      setLoading(false);
      setArticleData(articleData);
    }
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  } else if (articleData && collectionData) {
    return (
      <MainLayout
        pageNavigation={[
          {
            link: "/collections",
            text: "Collections",
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
          redirectTo={`/collections/${collectionData.id}`}
        />
      </MainLayout>
    );
  }
};
export default Page;
