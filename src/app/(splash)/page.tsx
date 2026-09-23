"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Splash: logo pulse, then onboarding on first launch or home. Mirrors `splash_screen.dart`. */
export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const seen = window.localStorage.getItem("tk_onboarded") === "1";
    const t = setTimeout(() => router.replace(seen ? "/home" : "/onboarding"), 1600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-primary to-primary-dark">
      <div className="splash-scale grid h-36 w-36 place-items-center rounded-[36px] bg-white shadow-lg">
        <Image
          src="/images/logo/logo_foreground.png"
          alt="Takos Korner"
          width={110}
          height={110}
          priority
        />
      </div>
      <h1 className="mt-6 text-2xl font-extrabold text-white">Takos Korner</h1>
      <p className="mt-1 text-sm text-white/80">Good food, fast.</p>
      <div className="mt-10 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="pulse-dot h-2 w-2 rounded-full bg-white"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </main>
  );
}
