"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { SafeImage } from "@/components/ui/SafeImage";
import { useFavorites } from "@/context/FavoritesContext";
import { productById, restaurantById } from "@/data/home";
import { reels } from "@/data/misc";
import type { ReelModel } from "@/data/models";
import { cn, money } from "@/lib/utils";

/** Mirrors `reels_screen.dart`: vertical snap feed of muted looping videos. Desktop: centered 9:16 column with a side rail. */
export function ReelsClient({ startId }: { startId?: number }) {
  const [muted, setMuted] = useState(true);
  const [active, setActive] = useState(() => Math.max(0, reels.findIndex((r) => r.id === startId)));
  const feed = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = feed.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            setActive(items.indexOf(e.target as HTMLElement));
          }
        }
      },
      { root: el, threshold: [0.6] },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = feed.current?.children[active] as HTMLElement | undefined;
    if (el && startId) el.scrollIntoView({ block: "start" });
    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-black md:bg-bg">
      <Container className="hidden items-end justify-between pt-8 md:flex">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Reels</h1>
          <p className="text-sm text-text-muted">Short videos from the kitchens around you</p>
        </div>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-semibold text-text shadow-card"
        >
          <Icon name={muted ? "muted-outline" : "volume-loud-outline"} size={18} />
          {muted ? "Unmute" : "Mute"}
        </button>
      </Container>

      <Container className="hidden gap-8 pb-10 md:grid lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="sticky top-24 aspect-[9/16] overflow-hidden rounded-3xl shadow-card">
          <Reel
            reel={reels[active] ?? reels[0]}
            active
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
          />
        </div>
        <div className="grid grid-cols-2 content-start gap-4 xl:grid-cols-3">
          {reels.map((r, i) => {
            const restaurant = restaurantById(r.restaurantId);
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card text-start shadow-card",
                  i === active ? "border-primary" : "border-border",
                )}
              >
                <span className="relative block aspect-[3/4]">
                  <SafeImage src={r.poster} alt="" fill sizes="240px" className="object-cover" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-primary">
                      <Icon name="play-bold" size={20} />
                    </span>
                  </span>
                </span>
                <span className="block p-3">
                  <span className="line-clamp-2 text-sm font-bold text-text">{r.caption}</span>
                  {restaurant && (
                    <span className="mt-1 block truncate text-xs text-text-muted">{restaurant.name}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </Container>

      <div className="flex flex-1 justify-center md:hidden">
        <div
          ref={feed}
          className="no-scrollbar h-[calc(100dvh-60px)] w-full snap-y snap-mandatory overflow-y-auto"
        >
          {reels.map((r, i) => (
            <Reel
              key={r.id}
              reel={r}
              active={i === active}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Reel({
  reel,
  active,
  muted,
  onToggleMute,
}: {
  reel: ReelModel;
  active: boolean;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [paused, setPaused] = useState(false);
  const restaurant = restaurantById(reel.restaurantId);
  const product = reel.productId ? productById(reel.productId) : undefined;
  const { isRestaurantFavorite, toggleRestaurant } = useFavorites();

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (active && !paused) v.play().catch(() => {});
    else v.pause();
  }, [active, paused]);

  return (
    <section className="relative h-full w-full snap-start bg-black">
      <video
        ref={video}
        src={reel.video}
        poster={reel.poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onClick={() => setPaused((p) => !p)}
        className="h-full w-full object-cover"
      />
      {paused && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-black/50 text-white">
            <Icon name="play-bold" size={32} />
          </span>
        </span>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* Top */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 md:hidden">
        <h1 className="text-lg font-bold text-white">Reels</h1>
        <button
          type="button"
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={onToggleMute}
          className="grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white"
        >
          <Icon name={muted ? "muted-outline" : "volume-loud-outline"} size={18} />
        </button>
      </div>

      {/* Right rail */}
      <div className="absolute end-3 bottom-28 flex flex-col items-center gap-5 text-white">
        <Rail
          icon="heart-bold"
          label={(reel.likes + (liked ? 1 : 0)).toLocaleString()}
          onClick={() => setLiked((l) => !l)}
          className={liked ? "text-danger" : undefined}
        />
        <Rail icon="chat-round-dots-outline" label={String(reel.comments)} />
        <Rail icon="share-outline" label="Share" />
        <button
          type="button"
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={onToggleMute}
          className="hidden h-11 w-11 place-items-center rounded-full bg-black/40 md:grid"
        >
          <Icon name={muted ? "muted-outline" : "volume-loud-outline"} size={20} />
        </button>
      </div>

      {/* Bottom */}
      <div className="absolute inset-x-0 bottom-0 p-4 pe-16 text-white">
        {restaurant && (
          <div className="flex items-center gap-2">
            <Link href={`/restaurant/${restaurant.id}`} className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
              <SafeImage src={restaurant.image} alt="" fill sizes="36px" className="object-cover" />
            </Link>
            <Link href={`/restaurant/${restaurant.id}`} className="text-sm font-bold">
              {restaurant.name}
            </Link>
            <button
              type="button"
              onClick={() => toggleRestaurant(restaurant.id)}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-bold",
                isRestaurantFavorite(restaurant.id) ? "bg-white/20" : "bg-primary",
              )}
            >
              {isRestaurantFavorite(restaurant.id) ? "Following" : "Follow"}
            </button>
          </div>
        )}
        <p className="mt-2 text-sm">{reel.caption}</p>
        {product && (
          <Link
            href={product.isCustomizable ? `/product/${product.id}/customize` : `/product/${product.id}`}
            className="mt-3 flex items-center gap-3 rounded-[14px] bg-white/15 p-2.5 backdrop-blur"
          >
            <span className="relative h-11 w-11 overflow-hidden rounded-[10px]">
              <SafeImage src={product.image} alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{product.name}</span>
              <span className="block text-xs text-white/80">{money(product.price)}</span>
            </span>
            <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold">
              <Icon name="cart-large-2-bold" size={14} />
              Order
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}

function Rail({
  icon,
  label,
  onClick,
  className,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1">
      <span className={cn("grid h-11 w-11 place-items-center rounded-full bg-black/40", className)}>
        <Icon name={icon} size={22} />
      </span>
      <span className="text-[11px] font-semibold drop-shadow">{label}</span>
    </button>
  );
}
