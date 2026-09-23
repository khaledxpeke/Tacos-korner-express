import Link from "next/link";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Icon } from "@/components/ui/Icon";

export const metadata = { title: "Coming soon · Takos Korner" };

/** Mirrors `coming_soon_screen.dart`. */
export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ feature?: string }>;
}) {
  const { feature } = await searchParams;
  return (
    <>
      <BackAppBar title={feature ?? "Coming soon"} fallbackHref="/settings" />
      <Page size="sm" className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="grid h-24 w-24 place-items-center rounded-full bg-primary-bg text-primary">
          <Icon name="rocket-2-bold" size={48} />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold text-text">Coming soon</h2>
        <p className="mt-2 text-sm text-text-body">
          {feature ? `${feature} is` : "This feature is"} on the way. We&apos;re cooking it up and
          will let you know when it&apos;s ready.
        </p>
        <Link
          href="/home"
          className="mt-8 rounded-[12px] bg-gradient-to-r from-primary to-primary-dark px-8 py-3 text-sm font-bold text-white shadow-card"
        >
          Back to Home
        </Link>
      </Page>
    </>
  );
}
