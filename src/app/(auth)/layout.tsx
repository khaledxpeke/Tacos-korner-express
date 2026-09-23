import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Auth shell. Phones: the screen itself (gradient header + form), like the app.
 * Desktop: brand panel on the left, the same screen as a card on the right.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 md:grid md:grid-cols-[1fr_minmax(420px,520px)] lg:grid-cols-[1.2fr_560px]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-[#7a0a10] text-white md:flex md:flex-col md:justify-between md:p-12">
        <Link href="/home" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white">
            <Image src="/images/logo/logo_foreground.png" alt="" width={40} height={40} />
          </span>
          <span className="text-xl font-bold">Takos Korner</span>
        </Link>
        <div className="max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight lg:text-5xl">
            Good food, <br /> delivered fast.
          </h2>
          <p className="mt-4 text-white/80">
            Hundreds of restaurants, dishes built your way, live order tracking. Join thousands of
            hungry people in Tunis.
          </p>
          <div className="mt-8 flex gap-6">
            <Stat value="120+" label="Restaurants" />
            <Stat value="15 min" label="Avg. delivery" />
            <Stat value="4.8 ★" label="Rating" />
          </div>
        </div>
        <p className="text-xs text-white/60">© {new Date().getFullYear()} Takos Korner Express</p>
        <Image
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80"
          alt=""
          fill
          sizes="60vw"
          className="pointer-events-none -z-10 object-cover opacity-20 mix-blend-luminosity"
        />
      </aside>
      <div className="flex flex-1 flex-col bg-bg md:min-h-dvh md:justify-center md:overflow-y-auto md:px-10 md:py-10">
        <div className="flex flex-1 flex-col md:flex-none md:overflow-hidden md:rounded-[28px] md:border md:border-border md:bg-card md:shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-white/70">{label}</p>
    </div>
  );
}
