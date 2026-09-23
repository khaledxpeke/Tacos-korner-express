import Image from "next/image";
import Link from "next/link";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Misc";
import { supportWebsite } from "@/data/misc";

export const metadata = { title: "About · Takos Korner" };

/** Mirrors `about_screen.dart`. */
export default function AboutPage() {
  return (
    <>
      <BackAppBar title="About" fallbackHref="/settings" />
      <Page>
        <Card className="flex flex-col items-center p-8 text-center md:flex-row md:items-center md:gap-8 md:p-10 md:text-start">
          <span className="grid h-24 w-24 shrink-0 place-items-center rounded-[28px] bg-primary-bg">
            <Image src="/images/logo/logo_foreground.png" alt="" width={72} height={72} />
          </span>
          <div>
            <h2 className="mt-4 text-xl font-extrabold text-text md:mt-0 md:text-3xl">Takos Korner</h2>
            <p className="text-sm text-text-muted md:text-base">Order from kitchens around you</p>
            <p className="mt-4 max-w-2xl text-sm text-text-body md:text-base md:leading-relaxed">
              Takos Korner connects you with the best kitchens in Tunis. Browse menus, build
              dishes your way, and follow your order from the oven to your door.
            </p>
          </div>
        </Card>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Feature icon="shop-bold" title="120+ restaurants" text="Burgers to sushi, all in one place." />
          <Feature icon="tuning-2-bold" title="Build your own" text="Sizes, sauces, toppings. Save combos." />
          <Feature icon="routing-outline" title="Live tracking" text="Know exactly when dinner lands." />
        </div>

        <Card className="mt-4 divide-y divide-border">
          <Row href="/terms" icon="document-text-outline" label="Terms of Service" />
          <Row href="/privacy" icon="shield-user-outline" label="Privacy Policy" />
          <Row href={supportWebsite} icon="global-outline" label="Website" external />
        </Card>

        <p className="mt-6 text-center text-xs text-text-muted">
          Made with ❤️ in Tunis · © {new Date().getFullYear()} Takos Korner
        </p>
      </Page>
    </>
  );
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <Card className="p-4 md:p-6">
      <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-primary-bg text-primary md:h-12 md:w-12">
        <Icon name={icon} size={20} />
      </span>
      <p className="mt-3 text-sm font-bold text-text md:text-base">{title}</p>
      <p className="mt-1 text-xs text-text-body md:text-sm">{text}</p>
    </Card>
  );
}

function Row({ href, icon, label, external }: { href: string; icon: string; label: string; external?: boolean }) {
  const cls = "flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-text md:px-5 md:py-4 md:text-base";
  const inner = (
    <>
      <Icon name={icon} size={18} className="text-text-muted" />
      <span className="flex-1">{label}</span>
      <Icon name={external ? "link-outline" : "alt-arrow-right-outline"} size={18} className="text-text-muted rtl:rotate-180" />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
