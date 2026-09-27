import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Confetti } from "@/components/ui/Confetti";
import { Icon } from "@/components/ui/Icon";

export const metadata = { title: "Order confirmed · Takos Korner" };

/** Mirrors `order_success_screen.dart`. */
export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  const { n } = await searchParams;
  const orderNumber = n ?? "TK-2000";

  return (
    <main className="flex flex-1 items-center">
      <Confetti />
      <Container size="sm" className="py-12 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-green-bg text-green">
          <Icon name="check-circle-bold" size={56} />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-text md:text-3xl">Order Confirmed! 🎉</h1>
        <p className="mt-2 text-sm text-text-body">
          Thanks for your order. The restaurant is getting started on it right away.
        </p>

        <div className="mt-8 rounded-card border-[0.5px] border-border bg-card p-5 shadow-card">
          <p className="text-xs font-bold tracking-wide text-text-muted md:text-sm">Order number</p>
          <p className="mt-1 text-2xl font-extrabold tracking-wide text-primary">{orderNumber}</p>
          <div className="my-4 h-px bg-border" />
          <div className="flex items-center justify-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-blue-bg text-blue">
              <Icon name="clock-circle-bold" size={22} />
            </span>
            <div className="text-start">
              <p className="text-xs text-text-muted">Estimated Delivery Time</p>
              <p className="text-base font-bold text-text">25 – 35 min</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/home"
            className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-linear-to-r from-primary to-primary-dark px-10 py-3 text-sm font-bold text-white shadow-card transition hover:brightness-95 sm:w-auto"
          >
            <Icon name="home-2-outline" size={18} />
            Back to Home
          </Link>
        </div>
      </Container>
    </main>
  );
}
