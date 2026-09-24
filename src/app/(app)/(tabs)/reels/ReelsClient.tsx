"use client";

import Link from "next/link";
import { Page } from "@/components/layout/Page";
import { Icon } from "@/components/ui/Icon";

/** Reels is not in the first release — keep the tab, show coming soon. */
export function ReelsClient() {
  return (
    <Page size="sm" className="flex flex-1 flex-col items-center justify-center text-center">
      <span className="grid h-24 w-24 place-items-center rounded-full bg-primary-bg text-primary">
        <Icon name="video-frame-play-horizontal-bold" size={48} />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold text-text">Reels — coming soon</h1>
      <p className="mt-2 text-sm text-text-body">
        Kitchen videos are on the way. For now, browse restaurants and build your order.
      </p>
      <Link
        href="/home"
        className="mt-8 rounded-[12px] bg-gradient-to-r from-primary to-primary-dark px-8 py-3 text-sm font-bold text-white shadow-card"
      >
        Browse restaurants
      </Link>
    </Page>
  );
}
