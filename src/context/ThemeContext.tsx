"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

export type ThemeMode = "light" | "dark";

interface ThemeCtx {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (t: ThemeMode) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<ThemeMode>("tk_theme", "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <Ctx.Provider
      value={{
        theme,
        isDark: theme === "dark",
        setTheme,
        toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme outside ThemeProvider");
  return v;
}
