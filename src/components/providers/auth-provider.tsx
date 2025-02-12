"use client";

import { auth } from "@/lib/cookie-service";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<User | null>(null);

export type User = {
  email: string;
  name: string;
  password: string;
  role: string;
};

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const currentUser = await auth();
    if (currentUser) {
      setUser(currentUser);
    }
  }
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
