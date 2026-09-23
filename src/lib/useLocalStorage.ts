"use client";

import { useEffect, useState } from "react";

/** Persist state to localStorage. Initial render always uses `initial` to keep SSR and client markup identical. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Deferred so the stored value is applied after hydration, not during the effect itself.
    const id = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw != null) setValue(JSON.parse(raw) as T);
      } catch {
        /* ignore */
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value, ready]);

  return [value, setValue, ready] as const;
}
