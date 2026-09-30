import Image from "next/image";
import type { ReactNode } from "react";

export function LoyaltyShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col md:grid md:grid-cols-2">
      <BrandAside />
      <div className="flex flex-1 flex-col bg-bg md:justify-center md:overflow-y-auto md:px-12 md:py-10">
        <div className="flex w-full flex-1 flex-col md:mx-auto md:max-w-[440px] md:flex-none">
          {children}
        </div>
      </div>
    </div>
  );
}

function BrandAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-linear-to-br from-primary via-primary-dark to-[#6e0a0f] text-white md:flex md:flex-col md:p-10 lg:p-14">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="blob-drift absolute -left-24 -top-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <span className="blob-drift absolute -right-16 -bottom-24 h-96 w-96 rounded-full bg-black/20 blur-3xl [animation-delay:-6s]" />
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, black, transparent 75%)",
          }}
        />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-lg shadow-black/10">
          <Image src="/images/logo/logo_foreground.png" alt="" width={36} height={36} />
        </span>
        <span className="text-lg font-bold lg:text-xl">Takos Korner</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center py-10">
        <p className="text-xs font-bold tracking-[0.18em] text-white/70 uppercase">Fidélité</p>
        <h2 className="brand-rise mt-3 max-w-md text-4xl leading-tight font-extrabold lg:text-5xl">
          Vos points, à chaque commande.
        </h2>
        <p className="mt-4 max-w-sm text-sm text-white/80 lg:text-base">
          Scannez le QR de la borne ou saisissez votre code. Le cashback se déduit sur le ticket.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/10 py-4 backdrop-blur">
        <Stat value="QR" label="sur la borne" />
        <Stat value="Code" label="8 caractères" />
        <Stat value="Remise" label="selon le restaurant" />
      </div>
    </aside>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-2 text-center">
      <p className="text-lg font-extrabold lg:text-xl">{value}</p>
      <p className="text-[11px] text-white/70">{label}</p>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-b-[28px] bg-linear-to-br from-primary to-primary-dark px-7 pt-12 pb-9 text-white md:rounded-none md:bg-transparent md:bg-none md:px-0 md:pt-0 md:pb-2 md:text-text">
      <div className="mb-4 flex items-center gap-2.5 md:hidden">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white">
          <Image src="/images/logo/logo_foreground.png" alt="" width={32} height={32} />
        </span>
        <span className="text-sm font-bold">Takos Korner</span>
      </div>
      <h1 className="text-[26px] font-extrabold">{title}</h1>
      <p className="mt-1.5 text-sm text-white/75 md:text-text-muted">{subtitle}</p>
    </div>
  );
}
