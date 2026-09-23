"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

export type Language = "en" | "fr" | "ar";

export const languages: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "fr", label: "French", native: "Français" },
  { code: "ar", label: "Arabic", native: "العربية" },
];

interface LanguageCtx {
  language: Language;
  isRtl: boolean;
  setLanguage: (l: Language) => void;
}

const Ctx = createContext<LanguageCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorage<Language>("tk_lang", "en");
  const isRtl = language === "ar";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [language, isRtl]);

  return (
    <Ctx.Provider value={{ language, isRtl, setLanguage }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLanguage() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLanguage outside LanguageProvider");
  return v;
}
