"use client";

import { Pack } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface PacksContextType {
  packs: Pack[];
  updatePacks: (e: Pack[]) => void;
}

// Create context with an initial value of null
export const PacksContext = createContext<PacksContextType>({
  packs: [],
  updatePacks: () => {},
});

const PacksDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [packs, setPacks] = useState<Pack[]>([]);

  function updatePacks(_Packs: Pack[]) {
    setPacks(_Packs);
  }

  return (
    <PacksContext.Provider
      value={{
        packs,
        updatePacks,
      }}
    >
      {children}
    </PacksContext.Provider>
  );
};

export default PacksDataProvider;
