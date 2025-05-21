"use client";
import React, { useEffect, useState } from "react";
import Mobile from "@/mobile.svg";
import { useTheme } from "next-themes";
import SwitchTheme from "../ui/theme-switcher";

export const ThemeSwitching = ({ children }: { children: React.ReactNode }) => {
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
    <div
      className="flex flex-col grow  w-full p-[25px] gap-[26px] group justify-between"
      data-mode={previewDark == "dark" ? "dark" : "light"}
    >
      {children}
      <SwitchTheme theme={previewDark} setTheme={setPreviewDark} />
    </div>
  );
};

const MobilePreview = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeSwitching>
      <div className="shrink-0 h-[716px] relative overflow-hidden ">
        <Mobile className="text-mobile-layout z-10 relative pointer-events-none h-full w-full" />
        <div
          className={`absolute group w-[calc(100%-32px)] h-[calc(100%-32px)] overflow-hidden rounded-[41px] top-4 left-5 z-0 bg-white text-black group-data-[mode='dark']:text-white group-data-[mode='dark']:bg-mobile-dark-background   `}
        >
          {children}
        </div>
      </div>
    </ThemeSwitching>
  );
};

export default MobilePreview;
