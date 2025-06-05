"use client";

import { Tip } from "@/types";
import { createContext, Dispatch, useState } from "react";

// Define the context type
export interface TipsContextType {
  tips: Tip[];
  updateTips: Dispatch<React.SetStateAction<Tip[]>>;
  // Add any other methods or properties you need in the context
}

// Create context with an initial value of null
export const TipsContext = createContext<TipsContextType>({
  tips: [],
  updateTips: () => {},
});

const TipsDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [tips, setTips] = useState<Tip[]>([]);

  return (
    <TipsContext.Provider
      value={{
        tips,
        updateTips: setTips,
      }}
    >
      {children}
    </TipsContext.Provider>
  );
};

export default TipsDataProvider;
