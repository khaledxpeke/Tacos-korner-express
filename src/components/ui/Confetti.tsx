"use client";

import { useEffect, useState, type CSSProperties } from "react";

const colors = ["#ec1d23", "#f59e0b", "#10b981", "#2596be", "#a855f7", "#ffbe59", "#ff6b70"];

/** Deterministic pseudo-random so server and client render the same pieces. */
function seeded(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const pieces = (() => {
  const rand = seeded(7);
  return Array.from({ length: 90 }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const power = 120 + rand() * 260;
    const bx = Math.cos(angle) * power;
    const by = Math.sin(angle) * power * 0.8 - 140;
    return {
      id: i,
      color: colors[i % colors.length],
      w: 6 + rand() * 6,
      h: rand() > 0.5 ? 10 + rand() * 6 : 6 + rand() * 4,
      round: rand() > 0.75,
      style: {
        "--bx": `${bx}px`,
        "--by": `${by}px`,
        "--fx": `${bx * 1.3 + (rand() - 0.5) * 160}px`,
        "--spin": `${(rand() > 0.5 ? 1 : -1) * (360 + rand() * 720)}deg`,
        "--dur": `${3 + rand() * 1.6}s`,
        "--delay": `${rand() * 0.15}s`,
        "--flutter": `${0.4 + rand() * 0.5}s`,
      } as CSSProperties,
    };
  });
})();

/** Paper confetti that pops out from `originY` and falls away, then unmounts after `durationMs`. */
export function Confetti({ originY = "32%", durationMs = 5000 }: { originY?: string; durationMs?: number }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), durationMs);
    return () => clearTimeout(t);
  }, [durationMs]);

  if (!show) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <div className="absolute left-1/2" style={{ top: originY }}>
        <span className="pop-ring absolute -left-16 -top-16 h-32 w-32 rounded-full border-4 border-primary/40" />
        {pieces.map((p) => (
          <span key={p.id} className="confetti-piece" style={p.style}>
            <span
              style={{
                width: p.w,
                height: p.round ? p.w : p.h,
                background: p.color,
                borderRadius: p.round ? 999 : 2,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
