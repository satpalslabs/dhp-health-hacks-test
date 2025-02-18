"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { createContext, useState } from "react";
export const DataContext = createContext<{
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>> | undefined;
} | null>(null);

const DataProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: any[];
}) => {
  const [data, setData] = useState(value);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
