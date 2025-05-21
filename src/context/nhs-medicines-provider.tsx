"use client";

import { NHSCondition } from "@/types";
import { createContext, useState } from "react";

// Define the context type
export interface NHSMedicinesContextType {
  NHSMedicines: NHSCondition[];
  setNHSMedicines: (e: NHSCondition[]) => void;
}

// Create context with an initial value of null
export const NHSMedicinesContext = createContext<NHSMedicinesContextType>({
  NHSMedicines: [],
  setNHSMedicines: () => {},
});

const NHSMedicinesDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [medicines, setMedicines] = useState<NHSCondition[]>([]);

  return (
    <NHSMedicinesContext.Provider
      value={{
        NHSMedicines: medicines,
        setNHSMedicines: setMedicines,
      }}
    >
      {children}
    </NHSMedicinesContext.Provider>
  );
};

export default NHSMedicinesDataProvider;
