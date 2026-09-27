"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Page } from "@/components/layout/Page";
import { CategoryCard } from "@/components/home/CategoryCard";
import { ProductCard } from "@/components/home/ProductCard";
import { PromoCarousel } from "@/components/home/PromoCard";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { PickupBrowse } from "@/components/home/PickupBrowse";
import { RestaurantsMap } from "@/components/home/RestaurantsMap";
import {
  RestaurantsViewToggle,
  SeeAllCard,
  type RestaurantsView,
} from "@/components/home/SeeAllCard";
import { SearchField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard } from "@/components/ui/Misc";
import { SafeImage } from "@/components/ui/SafeImage";
import { useFulfillment } from "@/context/FulfillmentContext";
import { categories, products, promos, recommendedProducts, restaurants } from "@/data/home";
import type { ProductModel, RestaurantModel } from "@/data/models";
import { productsForMode, restaurantMatchesCategory, restaurantsForMode } from "@/lib/restaurants";

export default function HomePage() {
  const router = useRouter();
  const [view, setView] = useState<RestaurantsView>("cards");
  const [category, setCategory] = useState<string | null>(null);
  const { mode } = useFulfillment();

  const byCategory = (list: ProductModel[]) =>
    category ? list.filter((p) => p.category === category) : list;

  const availableProducts = productsForMode(mode, products);
  const availableRestaurants = restaurantsForMode(mode, restaurants);

  const allNew = byCategory(availableProducts.filter((p) => p.isNew));
  const allPopular = byCategory(availableProducts.filter((p) => p.isFeatured));
  const newArrivals = allNew.slice(0, 4);
  const newIds = new Set(newArrivals.map((p) => p.id));
  const popular = allPopular.filter((p) => !newIds.has(p.id)).slice(0, 4);
  const shownIds = new Set([...newIds, ...popular.map((p) => p.id)]);
  const recommended = byCategory(productsForMode(mode, recommendedProducts))
    .filter((p) => !shownIds.has(p.id))
    .slice(0, 4);
  const matchedRestaurants = availableRestaurants.filter((r) =>
    restaurantMatchesCategory(r, category, availableProducts),
  );
  // More than six: show five and use the last slot as a "browse all" tile.
  const hasMoreRestaurants = matchedRestaurants.length > 6;
  const visibleRestaurants = matchedRestaurants.slice(0, hasMoreRestaurants ? 5 : 6);
  const seeAllRestaurants = () => router.push("/see-all?kind=restaurants");

  if (mode === "pickup") {
    return (
      <>
        <AppBar />
        <PickupBrowse restaurants={availableRestaurants} />
      </>
    );
  }

  return (
    <>
      <AppBar />
      <Page>
        {/* Phone: search field that opens Search (desktop has it in the header) */}
        <div className="flex items-center gap-2 md:hidden">
          <div
            role="link"
            tabIndex={0}
            onClick={() => router.push("/search")}
            onKeyDown={(e) => e.key === "Enter" && router.push("/search")}
            className="min-w-0 flex-1"
          >
            <SearchField
              placeholder="Search restaurants, dishes…"
              readOnly
              className="pointer-events-none"
            />
          </div>
          <button
            type="button"
            onClick={() => router.push("/search")}
            className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-sm font-semibold text-text shadow-card"
          >
            <Icon name="tuning-2-outline" size={18} />
            Filters
          </button>
        </div>

        <div className="mb-6 hidden md:block">
          <p className="text-sm font-semibold text-primary">Delivering across Tunis</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-text lg:text-4xl">
            Order from the kitchens around you
          </h1>
          <p className="mt-2 max-w-xl text-base text-text-muted">
            Burgers, pizza, tacos, and more — built your way and at your door in about 30 minutes.
          </p>
        </div>

        <div className="no-scrollbar mt-1 flex gap-2.5 overflow-x-auto py-1 md:mx-0 md:mt-0 md:grid md:grid-cols-9 md:gap-3 md:overflow-visible md:px-0 md:py-0">
          <CategoryCard
            category={{ name: "All", icon: "🍽️", color: "#F0F2F5" }}
            active={category === null}
            onClick={() => setCategory(null)}
          />
          {categories.map((c) => (
            <CategoryCard
              key={c.name}
              category={c}
              active={category === c.name}
              onClick={() => setCategory(category === c.name ? null : c.name)}
            />
          ))}
        </div>

        <section className="mt-5 md:mt-8">
          <SeeAllCard title="Today's offers" icon="gift-bold" iconClass="text-purple" />
          <div className="mt-2.5 md:mt-4">
            <PromoCarousel promos={promos} compact />
          </div>
        </section>

        <SeeAllCard
          className="mt-5 md:mt-8"
          title="Restaurants near you"
          icon="shop-bold"
          iconClass="text-primary"
          trailing={<RestaurantsViewToggle value={view} onChange={setView} />}
        />
        <div className="mt-2.5 md:mt-4">
          {view === "cards" ? (
            <>
              {visibleRestaurants.length === 0 ? (
                <EmptyCard
                  icon="shop-2-outline"
                  title="No restaurants found"
                  message="Try adjusting your filters or search again"
                />
              ) : (
                <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
                  {visibleRestaurants.map((r, i) => (
                    <RestaurantCard key={r.id} restaurant={r} eager={i === 0} />
                  ))}
                  {hasMoreRestaurants && (
                    <BrowseAllTile
                      restaurants={matchedRestaurants.slice(5)}
                      total={matchedRestaurants.length}
                      onClick={seeAllRestaurants}
                    />
                  )}
                </div>
              )}
            </>
          ) : (
            <RestaurantsMap
              restaurants={availableRestaurants}
              onSelect={(r) => router.push(`/restaurant/${r.id}`)}
            />
          )}
        </div>

        <ProductSection
          title="New Arrivals"
          icon="course-up-bold"
          iconClass="text-blue"
          items={newArrivals}
          onSeeAll={() => router.push("/see-all?kind=new")}
        />
        <ProductSection
          title="Popular Near You"
          icon="star-bold"
          iconClass="text-amber"
          items={popular}
          onSeeAll={() => router.push("/see-all?kind=popular")}
        />
        <ProductSection
          title="Recommended dishes"
          icon="cup-star-bold"
          iconClass="text-purple"
          items={recommended}
          onSeeAll={() => router.push("/see-all?kind=recommended")}
        />
      </Page>
    </>
  );
}

/** Last grid slot: a teaser of the kitchens that did not fit, linking to the full list. */
function BrowseAllTile({
  restaurants: more,
  total,
  onClick,
}: {
  restaurants: RestaurantModel[];
  total: number;
  onClick: () => void;
}) {
  const faces = more.slice(0, 3);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-card border border-border bg-card p-4 text-start shadow-card transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg md:flex-col md:justify-center md:gap-5 md:rounded-2xl md:p-8 md:text-center"
    >
      <span className="flex -space-x-3 rtl:space-x-reverse">
        {faces.map((r) => (
          <span
            key={r.id}
            className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-card shadow-sm md:h-14 md:w-14"
          >
            <SafeImage src={r.image} alt="" fill sizes="56px" className="object-cover" />
          </span>
        ))}
        {more.length > faces.length && (
          <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-card bg-primary-bg text-xs font-bold text-primary md:h-14 md:w-14 md:text-sm">
            +{more.length - faces.length}
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1 md:flex-none">
        <span className="block text-sm font-extrabold text-text md:text-lg">Browse all {total} restaurants</span>
        <span className="mt-0.5 block text-xs text-text-muted md:text-sm">
          {more.length} more kitchens deliver to you
        </span>
      </span>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-white transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
        <Icon name="alt-arrow-right-outline" size={18} className="rtl:rotate-180" />
      </span>
    </button>
  );
}

function ProductSection({
  title,
  icon,
  iconClass,
  items,
  onSeeAll,
}: {
  title: string;
  icon: string;
  iconClass: string;
  items: ProductModel[];
  onSeeAll: () => void;
}) {
  return (
    <section className="mt-5 md:mt-12">
      <SeeAllCard
        title={title}
        icon={icon}
        iconClass={iconClass}
        onSeeAll={items.length ? onSeeAll : undefined}
      />
      <div className="mt-2.5 md:mt-4">
        {items.length === 0 ? (
          <EmptyCard
            icon="chef-hat-outline"
            title="Nothing here yet"
            message="New dishes from kitchens near you will show up here."
          />
        ) : (
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto py-1 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} eager={i === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
