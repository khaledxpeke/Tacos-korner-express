"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * member: signed in. guest: browsing without an account (home, cart, settings only).
 * signedOut: logged out; the welcome screen asks for delivery / pickup again before browsing.
 */
export type SessionStatus = "member" | "guest" | "signedOut";

interface SessionCtx {
  status: SessionStatus;
  ready: boolean;
  isGuest: boolean;
  isMember: boolean;
  signIn: () => void;
  continueAsGuest: () => void;
  signOut: () => void;
}

const KEY = "tk_session";

/** Before sessions existed, a finished sign-in or sign-up left `tk_onboarded`. */
function readStatus(): SessionStatus {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === "member" || raw === "guest" || raw === "signedOut") return raw;
    return window.localStorage.getItem("tk_onboarded") ? "member" : "guest";
  } catch {
    return "guest";
  }
}

const Ctx = createContext<SessionCtx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatusState] = useState<SessionStatus>("guest");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    setStatusState(readStatus());
    setReady(true);
  }, []);

  function setStatus(next: SessionStatus) {
    setStatusState(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // Storage blocked: the session lasts until reload.
    }
  }

  return (
    <Ctx.Provider
      value={{
        status,
        ready,
        isGuest: status !== "member",
        isMember: status === "member",
        signIn: () => setStatus("member"),
        continueAsGuest: () => setStatus("guest"),
        signOut: () => setStatus("signedOut"),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSession() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
