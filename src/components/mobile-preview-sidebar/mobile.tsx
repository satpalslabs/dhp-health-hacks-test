"use client";
import React, { useEffect, useState } from "react";
import Mobile from "@/mobile.svg";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Sun } from "lucide-react";
import Moon from "@/moon-01.svg";
import { useTheme } from "next-themes";
import MobileHeader from "./mobile-header";

const MobilePreview = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const [previewDark, setPreviewDark] = useState<string | null>(null);

  // Load the theme only on the client
  useEffect(() => {
    const storedTheme =
      localStorage.getItem("preview-theme") ?? resolvedTheme ?? null;
    setPreviewDark(storedTheme);
  }, [resolvedTheme]);

  // Update localStorage when previewDark changes
  useEffect(() => {
    if (previewDark !== null) {
      localStorage.setItem("preview-theme", previewDark);
    }
  }, [previewDark]);

  if (previewDark === null) return null; // Prevent rendering until state is set
  return (
    <div className="flex flex-col grow justify-center w-full p-[25px] gap-[26px] ">
      <div className="shrink-0 h-[716px] relative overflow-hidden ">
        <Mobile className="text-mobile-layout z-10 relative pointer-events-none h-full w-full" />
        <div
          className={`absolute w-[calc(100%-32px)] h-[calc(100%-32px)] rounded-[41px] px-6 top-4 left-4 z-0  ${
            previewDark == "dark"
              ? "bg-mobile-dark-background text-white"
              : "bg-white text-black"
          } `}
        >
          <MobileHeader />
          <div>{children}</div>
        </div>
      </div>
      <Tabs
        defaultValue={previewDark}
        value={previewDark}
        className="w-full"
        onValueChange={(e) => {
          setPreviewDark(e);
        }}
      >
        <TabsList className="w-full p-1 rounded-xl gap-1 px-1">
          <TabsTrigger value="light" className="w-1/2 rounded-lg">
            <Sun />
          </TabsTrigger>
          <TabsTrigger value="dark" className="w-1/2 rounded-lg">
            <Moon />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default MobilePreview;
