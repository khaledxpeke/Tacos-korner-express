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

const DURATION = 3000;

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
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Remaining time and when the current countdown started, so hovering can pause it.
  const remaining = useRef(DURATION);
  const startedAt = useRef(0);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const hide = useCallback(() => {
    clear();
    setSnack(null);
    setPaused(false);
  }, [clear]);

  const run = useCallback(
    (ms: number) => {
      clear();
      remaining.current = ms;
      startedAt.current = Date.now();
      timer.current = setTimeout(hide, ms);
    },
    [clear, hide],
  );

  const show = useCallback(
    (message: string, type: SnackbarType = "info") => {
      setSnack({ message, type, id: Date.now() });
      setPaused(false);
      run(DURATION);
    },
    [run],
  );

  const pause = useCallback(() => {
    if (!timer.current) return;
    clear();
    remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
    setPaused(true);
  }, [clear]);

  const resume = useCallback(() => {
    setPaused(false);
    run(remaining.current);
  }, [run]);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {snack && (
        <Snackbar
          key={snack.id}
          message={snack.message}
          type={snack.type}
          duration={DURATION}
          paused={paused}
          onPause={pause}
          onResume={resume}
          onClose={hide}
        />
      )}
    </Ctx.Provider>
  );
}

export function useSnackbar() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSnackbar outside SnackbarProvider");
  return v;
}
