"use client";

import { HealthCondition } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface HConditionContextType {
  HConditions: HealthCondition[];
  updateHConditions: (e: HealthCondition[]) => void;
}

// Create context with an initial value of null
export const HConditionContext = createContext<HConditionContextType>({
  HConditions: [],
  updateHConditions: () => {},
});

const HConditionDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [HConditions, setHConditions] = useState<HealthCondition[]>([]);

  function updateHConditions(_HConditions: HealthCondition[]) {
    setHConditions(_HConditions);
  }

  return (
    <HConditionContext.Provider
      value={{
        HConditions,
        updateHConditions,
      }}
    >
      {children}
    </HConditionContext.Provider>
  );
};

export default HConditionDataProvider;
