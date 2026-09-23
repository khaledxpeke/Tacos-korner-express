"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/home/ProductCard";
import { ActionButton } from "@/components/home/RestaurantQuickPeek";
import { RestaurantsMap } from "@/components/home/RestaurantsMap";
import { SegmentedToggle } from "@/components/orders/OrdersViewToggle";
import { RoundButton } from "@/components/product/ProductHero";
import { RatingSummary, ReviewCard } from "@/components/restaurant/ReviewCard";
import { Button } from "@/components/ui/Button";
import { SearchField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard, SelectableChip } from "@/components/ui/Misc";
import { SafeImage } from "@/components/ui/SafeImage";
import { useFavorites } from "@/context/FavoritesContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { productsOfRestaurant } from "@/data/home";
import { reels } from "@/data/misc";
import type { RestaurantModel } from "@/data/models";
import { reviewsOf } from "@/data/reviews";
import { cn, money } from "@/lib/utils";

type Tab = "menu" | "videos" | "location";

/** Mirrors `restaurant_details_screen.dart`: hero, info, tabs Menu / Videos / Location. */
export function RestaurantDetailsClient({ restaurant }: { restaurant: RestaurantModel }) {
  const router = useRouter();
  const snack = useSnackbar();
  const { isRestaurantFavorite, toggleRestaurant } = useFavorites();
  const [tab, setTab] = useState<Tab>("menu");
  const [category, setCategory] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const menu = productsOfRestaurant(restaurant.id);
  const cats = Array.from(new Set(menu.map((p) => p.category)));
  const filtered = useMemo(
    () =>
      menu.filter(
        (p) =>
          (!category || p.category === category) &&
          (!q.trim() || p.name.toLowerCase().includes(q.trim().toLowerCase())),
      ),
    [menu, category, q],
  );
  const reviews = reviewsOf(restaurant.id);
  const videos = reels.filter((r) => r.restaurantId === restaurant.id);
  const isFav = isRestaurantFavorite(restaurant.id);

  const share = () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: restaurant.name, url }).catch(() => {});
    else {
      navigator.clipboard?.writeText(url);
      snack.show("Link copied", "success");
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="relative h-56 w-full md:h-72 lg:h-80">
        <SafeImage
          src={restaurant.image}
          alt={restaurant.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="absolute inset-x-0 top-0">
          <Container className="flex items-center justify-between pt-4">
            <RoundButton
              icon="alt-arrow-left-outline"
              label="Back"
              onClick={() => (window.history.length > 1 ? router.back() : router.push("/home"))}
              className="rtl:[&_svg]:rotate-180"
            />
            <div className="flex gap-2">
              <RoundButton
                icon="heart-bold"
                label="Favorite"
                onClick={() => toggleRestaurant(restaurant.id)}
                iconClass={isFav ? "text-danger" : undefined}
              />
              <RoundButton icon="share-outline" label="Share" onClick={share} />
            </div>
          </Container>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <Container className="pb-4 text-white">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2.5 py-[3px] text-[10px] font-bold md:px-3 md:py-1 md:text-xs",
                  restaurant.isOpen ? "bg-green" : "bg-black/60",
                )}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </span>
              <span className="text-xs text-white/80">{restaurant.cuisine}</span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold md:text-4xl">{restaurant.name}</h1>
          </Container>
        </div>
      </div>

      <main className="flex-1">
        <Container className="py-5 md:py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="lg:order-1">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <Stat icon="star-bold" iconClass="text-amber" label={`${restaurant.reviews} reviews`} value={String(restaurant.rating)} />
                <Stat icon="clock-circle-outline" iconClass="text-blue" label="Delivery" value={restaurant.deliveryTime} />
                <Stat
                  icon="delivery-outline"
                  iconClass="text-green"
                  label="Delivery fee"
                  value={restaurant.deliveryFee === 0 ? "Free" : money(restaurant.deliveryFee)}
                />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-text-body">{restaurant.description}</p>

              <SegmentedToggle<Tab>
                className="mt-5"
                value={tab}
                onChange={setTab}
                options={[
                  { value: "menu", label: "Menu", count: menu.length },
                  { value: "videos", label: "Videos", count: videos.length },
                  { value: "location", label: "Location" },
                ]}
              />

              {tab === "menu" && (
                <div className="mt-4">
                  <SearchField
                    placeholder="Search dishes…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onClear={() => setQ("")}
                  />
                  {cats.length > 1 && (
                    <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
                      <SelectableChip label="All" selected={!category} onClick={() => setCategory(null)} />
                      {cats.map((c) => (
                        <SelectableChip
                          key={c}
                          label={c}
                          selected={category === c}
                          onClick={() => setCategory(category === c ? null : c)}
                        />
                      ))}
                    </div>
                  )}
                  {filtered.length === 0 ? (
                    <EmptyCard
                      className="mt-4"
                      icon="bottle-bold"
                      title={category ? `No ${category} dishes yet.` : "No dishes yet."}
                      message="This restaurant is still adding its menu."
                    />
                  ) : (
                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
                      {filtered.map((p) => (
                        <ProductCard key={p.id} product={p} grid />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === "videos" && (
                <div className="mt-4">
                  {videos.length === 0 ? (
                    <EmptyCard
                      icon="video-frame-play-horizontal-outline"
                      title="No videos yet"
                      message="This restaurant hasn't posted any reels."
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {videos.map((v) => (
                        <Link
                          key={v.id}
                          href={`/reels?start=${v.id}`}
                          className="relative aspect-[9/14] overflow-hidden rounded-card"
                        >
                          <SafeImage src={v.poster} alt="" fill sizes="300px" className="object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <span className="absolute inset-0 grid place-items-center">
                            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-primary">
                              <Icon name="play-bold" size={20} />
                            </span>
                          </span>
                          <p className="absolute inset-x-3 bottom-3 line-clamp-2 text-xs font-semibold text-white">
                            {v.caption}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === "location" && (
                <div className="mt-4 flex flex-col gap-4">
                  <RestaurantsMap restaurants={[restaurant]} onSelect={() => {}} />
                  <InfoCard restaurant={restaurant} />
                </div>
              )}
            </div>

            {/* Sidebar (desktop) */}
            <aside className="flex flex-col gap-4 lg:order-2">
              <div className="hidden lg:block">
                <InfoCard restaurant={restaurant} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <ActionButton
                  label="Directions"
                  image="/images/google-maps.png"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`,
                      "_blank",
                    )
                  }
                />
                <ActionButton
                  label="Call"
                  icon="phone-calling-outline"
                  onClick={() => (window.location.href = `tel:${restaurant.phone}`)}
                />
                <ActionButton label="Share" icon="share-outline" onClick={share} />
              </div>

              <section className="rounded-card border-[0.5px] border-border bg-card p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-text">Reviews</h2>
                  <Link href={`/restaurant/${restaurant.id}/reviews`} className="text-xs font-semibold text-primary">
                    See all ({reviews.length})
                  </Link>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-3xl font-extrabold text-text">{restaurant.rating}</span>
                  <div className="text-xs text-text-muted">
                    <Icon name="star-bold" size={14} className="text-amber" /> {restaurant.reviews} ratings
                  </div>
                </div>
                {reviews.slice(0, 2).map((r) => (
                  <ReviewCard key={r.id} review={r} compact className="mt-3 border-0 p-0 shadow-none" />
                ))}
                <Button
                  title="See all reviews"
                  isTransparent
                  size="sm"
                  className="mt-4"
                  onClick={() => router.push(`/restaurant/${restaurant.id}/reviews`)}
                />
              </section>
              {reviews.length > 0 && (
                <div className="hidden lg:block">
                  <RatingSummary rating={restaurant.rating} count={restaurant.reviews} reviews={reviews} />
                </div>
              )}
            </aside>
          </div>
        </Container>
      </main>
    </>
  );
}

function Stat({
  icon,
  iconClass,
  label,
  value,
}: {
  icon: string;
  iconClass: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border-[0.5px] border-border bg-card px-2 py-3 text-center shadow-card md:py-4">
      <Icon name={icon} size={18} className={iconClass} />
      <span className="mt-1 text-sm font-extrabold text-text md:text-lg">{value}</span>
      <span className="text-[10px] text-text-muted md:text-sm">{label}</span>
    </div>
  );
}

function InfoCard({ restaurant }: { restaurant: RestaurantModel }) {
  return (
    <div className="rounded-card border-[0.5px] border-border bg-card p-4 shadow-card">
      <h2 className="text-sm font-bold text-text">Info</h2>
      <Row icon="map-point-bold" text={restaurant.address} />
      <Row icon="phone-outline" text={restaurant.phone} />
      <Row icon="clock-circle-outline" text={`${restaurant.openTime} – ${restaurant.closeTime}`} />
      <Row icon="map-outline" text={restaurant.zone} />
    </div>
  );
}

function Row({ icon, text }: { icon: string; text: string }) {
  return (
    <p className="mt-3 flex items-start gap-2 text-sm text-text-body">
      <Icon name={icon} size={16} className="mt-0.5 shrink-0 text-primary" />
      {text}
    </p>
  );
}
