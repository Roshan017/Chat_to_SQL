"use client";

import { AppProvider } from "./AppContext";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
