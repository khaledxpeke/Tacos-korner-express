"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Snackbar, type SnackbarType } from "@/components/ui/Snackbar";

interface SnackState {
  message: string;
  type: SnackbarType;
  id: number;
}

interface SnackbarCtx {
  show: (message: string, type?: SnackbarType) => void;
}

const Ctx = createContext<SnackbarCtx | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snack, setSnack] = useState<SnackState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, type: SnackbarType = "info") => {
    if (timer.current) clearTimeout(timer.current);
    setSnack({ message, type, id: Date.now() });
    timer.current = setTimeout(() => setSnack(null), 2200);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {snack && <Snackbar key={snack.id} message={snack.message} type={snack.type} />}
    </Ctx.Provider>
  );
}

export function useSnackbar() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSnackbar outside SnackbarProvider");
  return v;
}
