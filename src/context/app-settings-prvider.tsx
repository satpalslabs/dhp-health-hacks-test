"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AppSettings } from "@/types";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const AppSettingsContext = createContext<AppSettings | null>(null);

export function AppSettingsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/proxy/app-settings");
        if (!res.ok) {
          throw new Error("Failed to fetch User");
        }
        const data = await res.json();
        setAppSettings(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        router.push("/sign-in");
      }
    };
    fetchUser();
  }, [router]);

  return (
    <AppSettingsContext.Provider value={appSettings}>
      {loading ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        children
      )}
    </AppSettingsContext.Provider>
  );
}
