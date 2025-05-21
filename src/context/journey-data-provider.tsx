"use client";

import data from "@/lib/static-data/journey-data.json";
import { JourneyData } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface JourneyContextType {
  journeys: JourneyData[];
  updateJourneys: (e: JourneyData[]) => void;
}

// Create context with an initial value of null
export const JourneyContext = createContext<JourneyContextType>({
  journeys: [],
  updateJourneys: () => {},
});

const JourneyDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [journeys, setJourneys] = useState<JourneyData[]>(
    data as JourneyData[]
  );

  function updateJourneys(_journeys: JourneyData[]) {
    setJourneys(_journeys);
  }

  return (
    <JourneyContext.Provider
      value={{
        journeys,
        updateJourneys,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export default JourneyDataProvider;
