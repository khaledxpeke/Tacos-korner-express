"use client";

import { useMemo, useState, type CSSProperties, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { ProductCard } from "@/components/home/ProductCard";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { SeeAllCard } from "@/components/home/SeeAllCard";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/Dialog";
import { SearchField, Switch } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard, SelectableChip } from "@/components/ui/Misc";
import { useFulfillment } from "@/context/FulfillmentContext";
import { categories, maxProductPrice, products, restaurants } from "@/data/home";
import { productsForMode, restaurantsForMode } from "@/lib/restaurants";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { cn, money } from "@/lib/utils";

type Scope = "all" | "products" | "restaurants";
type Sort = "relevance" | "rating" | "priceAsc" | "priceDesc";

interface Filters {
  category: string | null;
  maxPrice: number;
  openNow: boolean;
  freeDelivery: boolean;
  sort: Sort;
}

const defaultFilters: Filters = {
  category: null,
  maxPrice: maxProductPrice,
  openNow: false,
  freeDelivery: false,
  sort: "relevance",
};

/** Filters that differ from the defaults, for the badge on the phone filter button. */
function activeFilterCount(f: Filters) {
  return [
    f.category != null,
    f.maxPrice < maxProductPrice,
    f.openNow,
    f.freeDelivery,
    f.sort !== "relevance",
  ].filter(Boolean).length;
}

export function SearchClient({
  initialQuery,
  initialCategory,
}: {
  initialQuery: string;
  initialCategory: string | null;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [scope, setScope] = useState<Scope>("all");
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters, category: initialCategory });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilters = activeFilterCount(filters);
  const [recent, setRecent] = useLocalStorage<string[]>("recent_searches", []);
  const { mode } = useFulfillment();
  const router = useRouter();

  const q = query.trim().toLowerCase();

  const dishResults = useMemo(() => {
    let list = productsForMode(mode, products).filter(
      (p) =>
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)) &&
        (!filters.category || p.category === filters.category) &&
        p.price <= filters.maxPrice,
    );
    if (filters.sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (filters.sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (filters.sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [q, filters, mode]);

  const restaurantResults = useMemo(() => {
    let list = restaurantsForMode(mode, restaurants).filter(
      (r) =>
        (!q ||
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.zone.toLowerCase().includes(q)) &&
        (!filters.category || r.cuisine.toLowerCase().includes(filters.category.toLowerCase())) &&
        (!filters.openNow || r.isOpen) &&
        (!filters.freeDelivery || r.deliveryFee === 0),
    );
    if (filters.sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [q, filters, mode]);

  const showProducts = scope !== "restaurants";
  const showRestaurants = scope !== "products";

  function commit(term: string) {
    const t = term.trim();
    if (!t) return;
    setRecent((r) => [t, ...r.filter((x) => x !== t)].slice(0, 8));
  }

  return (
    <>
      <BackAppBar title="Search" subtitle="Restaurants and dishes" />
      <Page>
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-8">
          {/* Phones and tablets open the same fields in a sheet from the button beside the search box. */}
          <aside className="hidden rounded-2xl border-[0.5px] border-border bg-card p-5 shadow-card lg:sticky lg:top-24 lg:block">
            <h2 className="text-base font-extrabold text-text">Filters</h2>
            <FilterFields
              filters={filters}
              setFilters={setFilters}
              className="mt-4"
            />
          </aside>
          <div>
        <div className="flex items-center gap-2">
          <form
            className="min-w-0 flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              commit(query);
            }}
          >
            <SearchField
              autoFocus
              placeholder="Search restaurants, dishes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            aria-label={activeFilters ? `Filters, ${activeFilters} active` : "Filters"}
            className={cn(
              "relative grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full border shadow-card transition lg:hidden",
              activeFilters
                ? "border-primary bg-primary text-white"
                : "border-border bg-card text-text hover:border-primary hover:text-primary",
            )}
          >
            <Icon name="tuning-2-outline" size={20} />
            {activeFilters > 0 && (
              <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-card px-1 text-[10px] font-extrabold text-primary ring-2 ring-primary">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
            {(
              [
                { v: "all", label: "All" },
                { v: "products", label: "Dishes" },
                { v: "restaurants", label: "Restaurants" },
              ] as const
            ).map((s) => (
              <SelectableChip
                key={s.v}
                label={s.label}
                selected={scope === s.v}
                onClick={() => setScope(s.v)}
              />
            ))}
          </div>
        </div>

        {q.length === 0 && recent.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wide text-text-muted md:text-sm md:tracking-normal">
                Recent searches
              </span>
              <button
                type="button"
                onClick={() => setRecent([])}
                className="text-xs font-semibold text-text-body"
              >
                Clear all
              </button>
            </div>
            <ul className="mt-2 overflow-hidden rounded-card border-[0.5px] border-border bg-card shadow-card">
              {recent.map((r) => (
                <li key={r} className="flex items-center gap-3 px-4 py-3">
                  <Icon name="history-outline" size={18} className="text-text-muted" />
                  <button
                    type="button"
                    onClick={() => setQuery(r)}
                    className="flex-1 text-start text-sm text-text"
                  >
                    {r}
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${r}`}
                    onClick={() => setRecent((l) => l.filter((x) => x !== r))}
                    className="text-text-muted"
                  >
                    <Icon name="close-circle-outline" size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

          <div className="mt-4 flex flex-col gap-5">
            {showProducts && (
              <section>
                <SeeAllCard
                  title="Dishes"
                  icon="rolling-pin-bold"
                  iconClass="text-amber"
                  trailing={<span className="text-xs text-text-muted">{dishResults.length}</span>}
                />
                {dishResults.length === 0 ? (
                  <EmptyCard
                    className="mt-2"
                    icon="chef-hat-outline"
                    title="No dishes found"
                    message="Try another word or clear the filters"
                  />
                ) : (
                  <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
                    {dishResults.map((p, i) => (
                      <ProductCard key={p.id} product={p} grid eager={i === 0} />
                    ))}
                  </div>
                )}
              </section>
            )}
            {showRestaurants && (
              <section>
                <SeeAllCard
                  title="Restaurants"
                  icon="chef-hat-bold"
                  iconClass="text-primary"
                  trailing={
                    <span className="text-xs text-text-muted">{restaurantResults.length}</span>
                  }
                />
                {restaurantResults.length === 0 ? (
                  <EmptyCard
                    className="mt-2"
                    icon="shop-2-outline"
                    title="No restaurants found"
                    message="Try another word or clear the filters"
                  />
                ) : (
                  <div className="mt-2 grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
                    {restaurantResults.map((r, i) => (
                      <RestaurantCard
                        key={r.id}
                        restaurant={r}
                        eager={i === 0}
                        onClick={() => router.push(`/restaurant/${r.id}`)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
          </div>
        </div>
      </Page>

      <BottomSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} className="lg:hidden">
        <div className="-mt-1 flex items-center gap-3 border-b border-border px-5 pb-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-bg text-primary">
            <Icon name="tuning-2-outline" size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-extrabold text-text">Filters</span>
            <span className="block text-xs text-text-muted">
              {activeFilters ? `${activeFilters} active` : "Narrow down dishes and restaurants"}
            </span>
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setFiltersOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full bg-card-gray text-text"
          >
            <Icon name="close-circle-bold" size={18} />
          </button>
        </div>
        <FilterFields filters={filters} setFilters={setFilters} className="px-5 pt-4" />
        <div className="mt-6 grid grid-cols-[auto_1fr] gap-3 px-5">
          <button
            type="button"
            onClick={() => setFilters(defaultFilters)}
            disabled={!activeFilters}
            className="rounded-[12px] border border-border px-5 text-sm font-bold text-text transition hover:border-primary hover:text-primary disabled:opacity-40"
          >
            Reset
          </button>
          <Button
            title={`Show ${(showProducts ? dishResults.length : 0) + (showRestaurants ? restaurantResults.length : 0)} results`}
            onClick={() => setFiltersOpen(false)}
          />
        </div>
      </BottomSheet>
    </>
  );
}

function FilterFields({
  filters,
  setFilters,
  className,
}: {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div>
        <p className="mb-2 text-xs font-bold text-text-body">Category</p>
        <div className="flex flex-wrap gap-2">
          <SelectableChip
            label="All"
            selected={!filters.category}
            onClick={() => setFilters((f) => ({ ...f, category: null }))}
          />
          {categories.map((c) => (
            <SelectableChip
              key={c.name}
              label={c.name}
              selected={filters.category === c.name}
              onClick={() => setFilters((f) => ({ ...f, category: c.name }))}
            />
          ))}
        </div>
      </div>
      <PriceSlider
        value={filters.maxPrice}
        min={5}
        max={Math.ceil(maxProductPrice)}
        onChange={(v) => setFilters((f) => ({ ...f, maxPrice: v }))}
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-text">Open now</span>
        <Switch checked={filters.openNow} onChange={(v) => setFilters((f) => ({ ...f, openNow: v }))} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-text">Free delivery</span>
        <Switch
          checked={filters.freeDelivery}
          onChange={(v) => setFilters((f) => ({ ...f, freeDelivery: v }))}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-bold text-text-body">Sort by</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { v: "relevance", label: "Relevance" },
              { v: "rating", label: "Top rated" },
              { v: "priceAsc", label: "Price: low to high" },
              { v: "priceDesc", label: "Price: high to low" },
            ] as const
          ).map((s) => (
            <SelectableChip
              key={s.v}
              label={s.label}
              selected={filters.sort === s.v}
              onClick={() => setFilters((f) => ({ ...f, sort: s.v }))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PriceSlider({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold text-text-body">Max price</span>
        <span className="rounded-full bg-primary-bg px-2.5 py-1 text-xs font-extrabold text-primary">
          {value >= max ? "Any price" : `Up to ${money(value)}`}
        </span>
      </div>
      <input
        type="range"
        aria-label="Max price"
        min={min}
        max={max}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-slider"
        style={{ "--pct": `${pct}%` } as CSSProperties}
      />
      <div className="mt-2 flex justify-between text-[11px] font-semibold text-text-muted">
        <span>{money(min)}</span>
        <span>{money(max)}</span>
      </div>
    </div>
  );
}
