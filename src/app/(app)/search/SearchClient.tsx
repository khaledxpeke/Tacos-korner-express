"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { ProductCard } from "@/components/home/ProductCard";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { SeeAllCard } from "@/components/home/SeeAllCard";
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

export function SearchClient({
  initialQuery,
  initialCategory,
}: {
  initialQuery: string;
  initialCategory: string | null;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [scope, setScope] = useState<Scope>("all");
  const [filters, setFilters] = useState<Filters>({
    category: initialCategory,
    maxPrice: maxProductPrice,
    openNow: false,
    freeDelivery: false,
    sort: "relevance",
  });
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
          <aside className="mb-5 rounded-2xl border-[0.5px] border-border bg-card p-5 shadow-card lg:sticky lg:top-24 lg:mb-0">
            <h2 className="text-base font-extrabold text-text">Filters</h2>
            <FilterFields
              filters={filters}
              setFilters={setFilters}
              className="mt-4"
            />
          </aside>
          <div>
        <form
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
                    icon="bottle-bold"
                    title="No dishes found"
                    message="Try another word or clear the filters"
                  />
                ) : (
                  <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-4">
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
                    icon="shop-bold"
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
      <div>
        <div className="mb-2 flex justify-between text-xs font-bold text-text-body">
          <span>Max price</span>
          <span className="text-primary">{money(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min={5}
          max={Math.ceil(maxProductPrice)}
          step={0.5}
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="w-full accent-primary"
        />
      </div>
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
