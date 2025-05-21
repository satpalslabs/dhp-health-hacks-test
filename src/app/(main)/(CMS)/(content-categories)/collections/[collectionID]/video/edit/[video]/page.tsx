"use client";

import AddArticle from "@/components/cms/articles/add-edit-articles";
import MainLayout from "@/components/main-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CollectionContext } from "@/context/collection-data-provider";
import { getSingleCollection } from "@/lib/services/collection-services";
import { getSingleVideo } from "@/lib/services/video-services.";
import { Article, Collection } from "@/types";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Page = ({
  params,
}: {
  params: Promise<{ video: string; collectionID: string }>;
}) => {
  const [articleData, setArticleData] = useState<Article>();
  const [loading, setLoading] = useState<boolean>(true);
  const [collectionData, setCollectionData] = useState<Collection>();
  const { collections } = useContext(CollectionContext);

  useEffect(() => {
    async function fetchData() {
      const { collectionID, video } = await params;

      let collection;
      collection = collections.find((i) => i.id === Number(collectionID));

      if (!collection) {
        collection = await getSingleCollection(Number(collectionID));
      }

      if (!collection) return redirect("/collections");

      setCollectionData(collection);
      
      const _articleData = await getSingleVideo(Number(video));
      if (!_articleData) return redirect(`/collections/${collectionID}`);

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
            text: "Edit Video",
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
