"use client";

import { NHSCondition } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface NHSConditionsContextType {
  NHSConditions: NHSCondition[];
  setNHSConditions: (e: NHSCondition[]) => void;
}

// Create context with an initial value of null
export const NHSConditionsContext = createContext<NHSConditionsContextType>({
  NHSConditions: [],
  setNHSConditions: () => {},
});

const NHSConditionDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [conditions, setConditions] = useState<NHSCondition[]>([]);

  return (
    <NHSConditionsContext.Provider
      value={{
        NHSConditions: conditions,
        setNHSConditions: setConditions,
      }}
    >
      {children}
    </NHSConditionsContext.Provider>
  );
};

export default NHSConditionDataProvider;
