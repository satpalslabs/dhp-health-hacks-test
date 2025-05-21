"use client";

import CollectionDetailPage from "@/components/cms/content-categories/collections/collection-overview";
import MainLayout from "@/components/main-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CollectionContext } from "@/context/collection-data-provider";
import { getSingleCollection } from "@/lib/services/collection-services";
import { Collection } from "@/types";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Page = ({ params }: { params: Promise<{ collectionID: string }> }) => {
  const [collectionData, setCollectionData] = useState<Collection>();
  const [loading, setLoading] = useState<boolean>(true);
  const { collections } = useContext(CollectionContext);

  useEffect(() => {
    async function fetchCollection() {
      const { collectionID } = await params;

      let collection;
      collection = collections.find((i) => i.id === Number(collectionID));

      if (!collection) {
        collection = await getSingleCollection(Number(collectionID));
      }

      if (!collection) return redirect("/collections");

      setLoading(false);
      setCollectionData(collection);
    }

    fetchCollection();
  }, [params]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  } else if (collectionData) {
    return (
      <MainLayout
        pageNavigation={[
          {
            link: "/collections",
            text: "Collections",
          },
          {
            text: collectionData.collection_name.split("_")[0],
            link: "",
          },
        ]}
      >
        <CollectionDetailPage collection={collectionData} />
      </MainLayout>
    );
  }
};
export default Page;
