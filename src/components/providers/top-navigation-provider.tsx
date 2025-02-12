"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { createContext, useState } from "react";
export const NavigationPathContext = createContext<{
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>> | undefined;
}>({
  data: [],
  setData: undefined,
});

const TopNavigationProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: any[];
}) => {
  const [data, setData] = useState(value);

  return (
    <NavigationPathContext.Provider
      value={{
        data,
        setData,
      }}
    >
      {children}
    </NavigationPathContext.Provider>
  );
};

export default TopNavigationProvider;
