"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type Role = "user" | "system" | "assistant";

export interface Message {
  id: string;
  role: Role;
  text?: string;
  sqlQuery?: string;
  timestamp: string;
}

export interface SchemaData {
  tables?: Record<
    string,
    {
      columns?: Record<string, string>;
      primary_key?: string | string[];
      foreign_keys?: Record<string, string>;
    }
  >;
  logical_to_physical?: Record<string, string[]>;
  [key: string]: unknown;
}

interface AppState {
  userId: string;
  dbId: string;
  schemaName: string;
  dbConnString: string;
  chatId: string;
  schemaData: SchemaData | null;
  messages: Message[];
}

interface AppContextType {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  resetState: () => void;
}

const defaultState: AppState = {
  userId: "",
  chatId: "",
  dbId: "",
  schemaName: "public",
  dbConnString: "",
  schemaData: null,
  messages: [
    {
      id: "system-1",
      role: "system",
      text: "Environment checks passed. Connected to DataSage Orchestrator. How can I help you today?",
      timestamp: "Now",
    },
  ],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "datasage_app_state";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // eslint-disable-next-line
        setState(() => parsed);
      } catch (e) {
        console.error("Failed to parse local storage state", e);
      }
    } else {
      // First time initialization
      setState((prev) => ({
        ...prev,
        userId: crypto.randomUUID(),
        chatId: crypto.randomUUID(),
      }));
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isMounted]);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    const newState = {
      ...defaultState,
      userId: crypto.randomUUID(),
      chatId: crypto.randomUUID(),
    };
    setState(newState);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  };

  // Prevent hydration mismatch by not rendering until client is mounted
  if (!isMounted) {
    return null; // Or a minimal loading skeleton
  }

  return (
    <AppContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
