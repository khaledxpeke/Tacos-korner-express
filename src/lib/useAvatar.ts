"use client";

import { useCallback, useEffect, useState } from "react";
import { fakeUser } from "@/data/misc";

const KEY = "tk_avatar";
const EVENT = "tk-avatar-change";

function read(): string | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    // Nothing stored yet: the demo account's photo. Stored "" means the user removed it.
    return raw == null ? fakeUser.avatar : raw || null;
  } catch {
    return fakeUser.avatar;
  }
}

/** Profile photo shared by the header, profile and edit screens. `null` means no photo. */
export function useAvatar() {
  const [avatar, setAvatarState] = useState<string | null>(fakeUser.avatar);

  useEffect(() => {
    const sync = () => setAvatarState(read());
    const id = window.setTimeout(sync, 0);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setAvatar = useCallback((next: string | null) => {
    try {
      window.localStorage.setItem(KEY, next ?? "");
    } catch {
      /* quota exceeded: keep it for this session only */
    }
    setAvatarState(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [avatar, setAvatar] as const;
}
