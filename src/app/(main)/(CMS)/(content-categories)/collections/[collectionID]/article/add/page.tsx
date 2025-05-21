"use client";

import AddArticle from "@/components/cms/articles/add-edit-articles";
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

      setCollectionData(collection);

      setLoading(false);
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
            collection: collectionData.id,
            section: null, // Replace with appropriate value if available
            sub_section: null, // Replace with appropriate value if available
          }}
          redirectTo={`/collections/${collectionData.id}`}
        />
      </MainLayout>
    );
  }
};
export default Page;
