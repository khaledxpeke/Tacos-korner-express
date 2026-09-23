"use client";

import { SafeImage as Image } from "@/components/ui/SafeImage";
import { Icon } from "@/components/ui/Icon";
import { useFavorites } from "@/context/FavoritesContext";
import type { RestaurantModel } from "@/data/models";
import { cn, money } from "@/lib/utils";

/** Mirrors `restaurant_card.dart`. */
export function RestaurantCard({
  restaurant,
  onClick,
  className,
}: {
  restaurant: RestaurantModel;
  onClick?: () => void;
  className?: string;
}) {
  const { isRestaurantFavorite, toggleRestaurant } = useFavorites();
  const isFav = isRestaurantFavorite(restaurant.id);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn(
        "cursor-pointer overflow-hidden rounded-card border-[0.5px] border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-lg md:rounded-2xl",
        className,
      )}
    >
      <div className="relative h-[132px] w-full md:h-52">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          sizes="(max-width: 640px) 100vw, 600px"
          className="object-cover"
        />
        <button
          type="button"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            toggleRestaurant(restaurant.id);
          }}
          className="absolute start-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-black/35"
        >
          <Icon
            name="heart-bold"
            size={16}
            className={isFav ? "text-danger" : "text-white"}
          />
        </button>
        {!restaurant.isOpen && (
          <span className="absolute end-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-[3px] text-[10px] font-bold text-white">
            Closed
          </span>
        )}
      </div>
      <div className="px-3.5 pb-3.5 pt-3 md:px-4 md:pb-4 md:pt-4">
        <h3 className="text-sm font-extrabold text-text md:text-lg">{restaurant.name}</h3>
        <p className="mt-0.5 text-[11px] text-text-muted md:text-sm">{restaurant.cuisine}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] md:mt-3 md:gap-x-3 md:text-sm">
          <span className="flex items-center gap-1 font-semibold text-text">
            <Icon name="star-bold" size={12} className="text-amber" />
            {restaurant.rating} ({restaurant.reviews})
          </span>
          <span className="flex items-center gap-1 text-text-muted">
            <Icon name="clock-circle-outline" size={11} />
            {restaurant.deliveryTime}
          </span>
          {restaurant.deliveryFee === 0 ? (
            <span className="rounded-full bg-green/10 px-2 py-0.5 text-[10px] font-bold text-green">
              Free delivery
            </span>
          ) : (
            <span className="flex items-center gap-1 text-text-muted">
              <Icon name="delivery-outline" size={11} />
              {money(restaurant.deliveryFee)}
            </span>
          )}
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-[10px] text-text-muted md:mt-2 md:text-xs">
          <Icon name="map-point-bold" size={11} />
          {restaurant.zone}
        </p>
      </div>
    </div>
  );
}
