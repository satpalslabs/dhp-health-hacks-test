"use client";

import { Collection } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface CollectionContextType {
  collections: Collection[];
  updateCollections: (e: Collection[]) => void;
}

// Create context with an initial value of null
export const CollectionContext = createContext<CollectionContextType>({
  collections: [],
  updateCollections: () => {},
});

const CollectionDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  function updateCollections(_collections: Collection[]) {
    setCollections(_collections);
  }

  return (
    <CollectionContext.Provider
      value={{
        collections,
        updateCollections,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export default CollectionDataProvider;
