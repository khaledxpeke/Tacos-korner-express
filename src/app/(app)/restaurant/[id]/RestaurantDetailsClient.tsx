"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/home/ProductCard";
import { RestaurantsMap } from "@/components/home/RestaurantsMap";
import { SegmentedToggle } from "@/components/orders/OrdersViewToggle";
import { RatingSummary, ReviewCard } from "@/components/restaurant/ReviewCard";
import { SearchField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard, SelectableChip } from "@/components/ui/Misc";
import { SafeImage } from "@/components/ui/SafeImage";
import { useFavorites } from "@/context/FavoritesContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { useCart } from "@/context/CartContext";
import { productsOfRestaurant } from "@/data/home";
import type { RestaurantModel } from "@/data/models";
import { reviewsOf } from "@/data/reviews";
import { cn, money } from "@/lib/utils";

type Tab = "menu" | "location";

/** Mirrors `restaurant_details_screen.dart`: hero, info, tabs Menu / Videos / Location. */
export function RestaurantDetailsClient({ restaurant }: { restaurant: RestaurantModel }) {
  const snack = useSnackbar();
  const cart = useCart();
  const { isRestaurantFavorite, toggleRestaurant } = useFavorites();
  const [tab, setTab] = useState<Tab>("menu");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const menu = productsOfRestaurant(restaurant.id);
  const cats = Array.from(new Set(menu.map((p) => p.category)));
  const sections = useMemo(() => {
    const query = q.trim().toLowerCase();
    return cats
      .map((name) => ({
        name,
        items: menu.filter(
          (p) => p.category === name && (!query || p.name.toLowerCase().includes(query)),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [cats, menu, q]);

  useEffect(() => {
    setActiveCat((current) =>
      current && sections.some((s) => s.name === current) ? current : (sections[0]?.name ?? null),
    );
  }, [sections]);

  useEffect(() => {
    if (tab !== "menu" || sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const name = hit?.target.getAttribute("data-menu-cat");
        if (name) setActiveCat(name);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    for (const section of sections) {
      const node = sectionRefs.current[section.name];
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [sections, tab]);

  function goToCategory(name: string) {
    setActiveCat(name);
    if (q.trim()) setQ("");
    requestAnimationFrame(() => {
      sectionRefs.current[name]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  const reviews = reviewsOf(restaurant.id);
  const isFav = isRestaurantFavorite(restaurant.id);
  const bag = cart.items.filter((i) => i.restaurantName === restaurant.name);
  const bagCount = bag.reduce((n, i) => n + i.quantity, 0);
  const bagTotal = bag.reduce((n, i) => n + i.price * i.quantity, 0);

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
        <div className="absolute inset-x-0 bottom-0">
          <Container className="pb-4 text-white md:pb-6">
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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <nav className="flex items-center gap-2 text-sm text-text-muted">
              <Link href="/home" className="inline-flex items-center gap-1 font-semibold hover:text-primary">
                <Icon name="alt-arrow-left-outline" size={16} className="rtl:rotate-180 md:hidden" />
                <span className="md:hidden">Restaurants</span>
                <span className="hidden md:inline">Home</span>
              </Link>
              <Icon name="alt-arrow-right-outline" size={14} className="hidden rtl:rotate-180 md:inline" />
              <span className="hidden text-text md:inline">{restaurant.name}</span>
            </nav>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleRestaurant(restaurant.id)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                  isFav
                    ? "border-primary bg-primary-bg text-primary"
                    : "border-border bg-card text-text hover:border-primary hover:text-primary",
                )}
              >
                <Icon name={isFav ? "heart-bold" : "heart-outline"} size={16} />
                {isFav ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={share}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
              >
                <Icon name="share-outline" size={16} />
                Share
              </button>
            </div>
          </div>

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
                  { value: "location", label: "Location" },
                ]}
              />

              {tab === "menu" && (
                <div className="mt-4">
                  {cats.length > 0 && (
                    <div className="sticky top-0 z-10 -mx-5 mb-3 bg-bg/95 px-5 py-2 backdrop-blur md:top-[4.25rem] md:mx-0 md:px-0">
                      <div className="no-scrollbar flex gap-2 overflow-x-auto">
                        {cats.map((name) => (
                          <SelectableChip
                            key={name}
                            label={name}
                            selected={activeCat === name}
                            onClick={() => goToCategory(name)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <SearchField
                    placeholder="Search dishes…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onClear={() => setQ("")}
                  />
                  {sections.length === 0 ? (
                    <EmptyCard
                      className="mt-4"
                      icon="bottle-bold"
                      title={q.trim() ? "No matching dishes" : "No dishes yet."}
                      message={
                        q.trim()
                          ? "Try another search or pick a different category."
                          : "This restaurant is still adding its menu."
                      }
                    />
                  ) : (
                    <div className="mt-4 flex flex-col gap-8">
                      {sections.map((section, sectionIndex) => (
                        <section
                          key={section.name}
                          data-menu-cat={section.name}
                          ref={(node) => {
                            sectionRefs.current[section.name] = node;
                          }}
                          className="scroll-mt-24 md:scroll-mt-36"
                        >
                          <h2 className="text-base font-extrabold text-text md:text-xl">
                            {section.name}
                          </h2>
                          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
                            {section.items.map((p, i) => (
                              <ProductCard
                                key={p.id}
                                product={p}
                                grid
                                eager={sectionIndex === 0 && i === 0}
                              />
                            ))}
                          </div>
                        </section>
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
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
                >
                  <Icon name="map-point-bold" size={16} className="text-primary" />
                  Directions
                </a>
                <a
                  href={`tel:${restaurant.phone}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
                >
                  <Icon name="phone-calling-outline" size={16} className="text-primary" />
                  Call
                </a>
              </div>

              <section className="rounded-card border-[0.5px] border-border bg-card p-4 shadow-card">
                {reviews.length > 0 && (
                  <RatingSummary
                    rating={restaurant.rating}
                    count={restaurant.reviews}
                    reviews={reviews}
                    className="border-0 p-0 shadow-none"
                  />
                )}
                <div className={cn("flex items-center justify-between", reviews.length > 0 && "mt-4")}>
                  <h2 className="text-sm font-bold text-text">Reviews</h2>
                  <Link href={`/restaurant/${restaurant.id}/reviews`} className="text-xs font-semibold text-primary">
                    See all ({reviews.length})
                  </Link>
                </div>
                {reviews.slice(0, 2).map((r) => (
                  <ReviewCard key={r.id} review={r} compact className="mt-3 border-0 p-0 shadow-none" />
                ))}
              </section>
            </aside>
          </div>
        </Container>
      </main>

      {bagCount > 0 && (
        <div className="sticky bottom-16 z-20 border-t border-border bg-card/95 px-5 py-3 backdrop-blur md:bottom-0">
          <Container className="flex items-center justify-between gap-3 !px-0">
            <p className="text-sm font-semibold text-text">
              {bagCount} {bagCount === 1 ? "item" : "items"} · {money(bagTotal)}
            </p>
            <Link
              href="/cart"
              className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-dark"
            >
              View cart
            </Link>
          </Container>
        </div>
      )}

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
