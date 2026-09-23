"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Page } from "@/components/layout/Page";
import { CategoryCard } from "@/components/home/CategoryCard";
import { ProductCard } from "@/components/home/ProductCard";
import { PromoCarousel, PromoMiniCard } from "@/components/home/PromoCard";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { PickupBrowse } from "@/components/home/PickupBrowse";
import { RestaurantsMap } from "@/components/home/RestaurantsMap";
import {
  RestaurantsViewToggle,
  SeeAllCard,
  type RestaurantsView,
} from "@/components/home/SeeAllCard";
import { SearchField } from "@/components/ui/Fields";
import { EmptyCard } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { useFulfillment } from "@/context/FulfillmentContext";
import { categories, products, promos, restaurants } from "@/data/home";
import type { ProductModel } from "@/data/models";
import { productsForMode, restaurantsForMode } from "@/lib/restaurants";

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
  const popular = allPopular.slice(0, 4);
  const visibleRestaurants = availableRestaurants.slice(0, 6);

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
        <div
          role="link"
          tabIndex={0}
          onClick={() => router.push("/search")}
          onKeyDown={(e) => e.key === "Enter" && router.push("/search")}
          className="md:hidden"
        >
          <SearchField
            placeholder="Search restaurants, dishes…"
            readOnly
            className="pointer-events-none"
          />
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

        <div className="mt-5 md:mt-0">
          <PromoCarousel promos={promos} />
        </div>

        <div className="no-scrollbar -mx-5 mt-4 flex gap-2.5 overflow-x-auto px-5 py-1 md:mx-0 md:mt-10 md:grid md:grid-cols-9 md:gap-3 md:overflow-visible md:px-0 md:py-0">
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

        <section className="mt-5 md:mt-12">
          <SeeAllCard title="Today's offers" icon="gift-bold" iconClass="text-purple" />
          <div className="no-scrollbar -mx-5 mt-2.5 flex gap-2.5 overflow-x-auto px-5 md:mx-0 md:mt-4 md:grid md:grid-cols-3 md:gap-5 md:px-0">
            {promos.map((p) => (
              <PromoMiniCard key={p.title} promo={p} wide />
            ))}
          </div>
        </section>

        <SeeAllCard
          className="mt-5 md:mt-8"
          title="All Restaurants"
          icon="shop-bold"
          iconClass="text-primary"
          trailing={<RestaurantsViewToggle value={view} onChange={setView} />}
        />
        <div className="mt-2.5 md:mt-4">
          {view === "cards" ? (
            <>
              {visibleRestaurants.length === 0 ? (
                <EmptyCard
                  icon="shop-bold"
                  title="No restaurants found"
                  message="Try adjusting your filters or search again"
                />
              ) : (
                <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
                  {visibleRestaurants.map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
                </div>
              )}
              {availableRestaurants.length > visibleRestaurants.length && (
                <Button
                  title="See all restaurants"
                  isTransparent
                  icon="alt-arrow-right-outline"
                  iconRight
                  className="mt-3 md:mx-auto md:mt-6 md:w-auto md:px-8"
                  onClick={() => router.push("/see-all?kind=restaurants")}
                />
              )}
            </>
          ) : (
            <RestaurantsMap
              restaurants={availableRestaurants}
              onSelect={(r) => router.push(`/restaurant/${r.id}`)}
            />
          )}
        </div>
      </Page>
    </>
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
            icon="bottle-bold"
            title="No dishes found"
            message="Try adjusting your filters or search again"
          />
        ) : (
          <div className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
