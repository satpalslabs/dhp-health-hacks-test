"use client";

import data from "@/lib/static-data/content-data/tips.json";
import { Tip } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface TipsContextType {
  tips: Tip[];
  updateTips: (e: Tip[]) => void;
}

// Create context with an initial value of null
export const TipsContext = createContext<TipsContextType>({
  tips: [],
  updateTips: () => {},
});

const TipsDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [tips, setTips] = useState<Tip[]>(data as Tip[]);

  function updateTips(_tips: Tip[]) {
    setTips(_tips);
  }

  return (
    <TipsContext.Provider
      value={{
        tips,
        updateTips,
      }}
    >
      {children}
    </TipsContext.Provider>
  );
};

export default TipsDataProvider;
