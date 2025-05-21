"use client";

import { SubSection } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface SubSectionContextType {
  subSections: SubSection[];
  updateSubSections: (e: SubSection[]) => void;
}

// Create context with an initial value of null
export const SubSectionContext = createContext<SubSectionContextType>({
  subSections: [],
  updateSubSections: () => {},
});

const SubSectionDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [subSections, setSubSections] = useState<SubSection[]>([]);

  function updateSubSections(_subSections: SubSection[]) {
    setSubSections(_subSections);
  }

  return (
    <SubSectionContext.Provider
      value={{
        subSections,
        updateSubSections,
      }}
    >
      {children}
    </SubSectionContext.Provider>
  );
};

export default SubSectionDataProvider;
