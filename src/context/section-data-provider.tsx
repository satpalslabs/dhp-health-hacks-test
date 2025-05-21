"use client";

import { Section } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface SectionContextType {
  sections: Section[];
  updateSections: (e: Section[]) => void;
}

// Create context with an initial value of null
export const SectionContext = createContext<SectionContextType>({
  sections: [],
  updateSections: () => {},
});

const SectionDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [sections, setSections] = useState<Section[]>([]);

  function updateSections(_Sections: Section[]) {
    setSections(_Sections);
  }

  return (
    <SectionContext.Provider
      value={{
        sections,
        updateSections,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};

export default SectionDataProvider;
