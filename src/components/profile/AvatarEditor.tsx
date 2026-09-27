"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useSnackbar } from "@/context/SnackbarContext";
import { useAvatar } from "@/lib/useAvatar";

/** Crops the picked image to a centered square and shrinks it so it fits in localStorage. */
function toSquareDataUrl(file: File, size = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no canvas"));
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

/** Large centered photo; the camera button opens Choose / Remove. */
export function AvatarEditor() {
  const snack = useSnackbar();
  const [avatar, setAvatar] = useAvatar();
  const [menu, setMenu] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const hide = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setMenu(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("mousedown", hide);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", hide);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);

  async function pick(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      snack.show("Choose an image file", "error");
      return;
    }
    try {
      setAvatar(await toSquareDataUrl(file));
      snack.show("Photo updated", "success");
    } catch {
      snack.show("Couldn't read that image", "error");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div ref={box} className="relative">
        <UserAvatar
          className="h-28 w-28 shadow-card ring-4 ring-card md:h-32 md:w-32"
          sizes="128px"
          initialsClass="text-4xl"
        />
        <button
          type="button"
          aria-label="Change photo"
          aria-haspopup="menu"
          aria-expanded={menu}
          onClick={() => setMenu((v) => !v)}
          className="absolute bottom-1 end-1 grid h-10 w-10 place-items-center rounded-full bg-primary text-white shadow-lg ring-4 ring-bg transition hover:bg-primary-dark"
        >
          <Icon name="camera-outline" size={18} />
        </button>
        {menu && (
          <div
            role="menu"
            className="fade-in absolute start-1/2 top-full z-20 mt-3 w-52 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card py-1 shadow-lg rtl:translate-x-1/2"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenu(false);
                input.current?.click();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm font-semibold text-text hover:bg-bg"
            >
              <Icon name="gallery-add-outline" size={18} className="text-primary" />
              {avatar ? "Change photo" : "Add photo"}
            </button>
            {avatar && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenu(false);
                  setAvatar(null);
                  snack.show("Photo removed", "info");
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm font-semibold text-danger hover:bg-danger-bg"
              >
                <Icon name="trash-bin-minimalistic-outline" size={18} />
                Remove photo
              </button>
            )}
          </div>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
