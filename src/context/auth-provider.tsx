"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  user: User | null;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}>({ user: null, setRefetch: () => {} });

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refetch, setRefetch] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/user");
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setLoading(false);
        } else {
          router.push("/sign-in");
        }
      } catch (error) {
        console.error(error);
        router.push("/sign-in");
      }
    };
    fetchUser();
  }, [refetch, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setRefetch,
      }}
    >
      {loading ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
