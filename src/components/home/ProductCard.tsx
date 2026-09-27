"use client";

import { useState } from "react";
import { SafeImage as Image } from "@/components/ui/SafeImage";
import { useRouter } from "next/navigation";
import { CustomizePanel } from "@/components/product/CustomizePanel";
import { FavoriteHeart } from "@/components/ui/FavoriteHeart";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { restaurantOf } from "@/data/home";
import type { ProductModel } from "@/data/models";
import { cn, money } from "@/lib/utils";

/**
 * Dish tile. Click or + opens the same add-to-cart popup
 * (customize options when the dish has them).
 */
export function ProductCard({
  product,
  grid,
  className,
  eager,
}: {
  product: ProductModel;
  grid?: boolean;
  className?: string;
  eager?: boolean;
}) {
  const router = useRouter();
  const cart = useCart();
  const { isProductFavorite, toggleProduct } = useFavorites();
  const restaurant = restaurantOf(product);
  const isFav = isProductFavorite(product.name);
  const [open, setOpen] = useState(false);
  const inCart = cart.items
    .filter(
      (item) =>
        item.productId === product.id ||
        (item.name === product.name && item.restaurantName === restaurant.name),
    )
    .reduce((n, item) => n + item.quantity, 0);

  return (
    <>
    <div
      role="button"
      tabIndex={0}
      onClick={() => setOpen(true)}
      onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      className={cn(
        "group flex shrink-0 cursor-pointer flex-col overflow-hidden rounded-card border-[0.5px] border-border bg-card text-start shadow-card transition hover:shadow-lg md:rounded-2xl",
        !open && "hover:-translate-y-0.5",
        grid ? "w-full" : "w-[146px] md:w-full",
        className,
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "relative w-full overflow-hidden md:h-auto md:aspect-[4/3]",
            grid ? "h-28" : "h-24",
          )}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 146px, 300px"
            loading={eager ? "eager" : undefined}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-black/25 to-transparent" />
        </div>
        <button
          type="button"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            toggleProduct(product.name);
          }}
          className="group/fav absolute start-2 top-2 drop-shadow-md"
        >
          <FavoriteHeart saved={isFav} />
        </button>
        {product.isNew && (
          <span className="absolute end-2 top-2 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-white shadow-sm md:px-2 md:text-[10px]">
            NEW
          </span>
        )}
        <button
          type="button"
          aria-label={
            inCart > 0
              ? `${inCart} in cart, add another`
              : product.isCustomizable
                ? "Customize"
                : "Add to cart"
          }
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className={cn(
            "absolute -bottom-4 end-2.5 z-10 grid h-8 min-w-8 place-items-center rounded-full px-1 shadow-md ring-2 ring-card transition-all duration-200 hover:scale-110 active:scale-95 md:-bottom-5 md:end-3 md:h-10 md:min-w-10",
            inCart > 0
              ? "bg-primary text-white"
              : "bg-card text-primary hover:bg-primary hover:text-white",
          )}
        >
          {inCart > 0 ? (
            <span className="text-xs font-extrabold md:text-sm">{inCart}</span>
          ) : (
            <Icon name="add-bold" size={18} className="md:hidden" />
          )}
          {inCart === 0 && <Icon name="add-bold" size={22} className="hidden md:block" />}
        </button>
      </div>
      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2 md:px-4 md:pb-4 md:pt-3">
        <p className="line-clamp-2 h-[30px] pe-8 text-xs font-bold leading-[15px] text-text md:h-auto md:pe-10 md:text-base md:font-extrabold md:leading-snug">
          {product.name}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/restaurant/${restaurant.id}`);
          }}
          className="mt-0.5 flex max-w-full items-center gap-1 self-start text-[10px] font-semibold text-text-muted transition hover:text-primary md:mt-1 md:text-xs"
        >
          <Icon name="shop-outline" size={12} />
          <span className="truncate">{restaurant.name}</span>
        </button>
        <p className="mt-1.5 hidden text-xs text-text-muted md:line-clamp-2 md:text-sm">
          {product.description}
        </p>
        <div className="mt-auto flex items-end justify-between pt-1.5 md:pt-3">
          <span className="text-[13px] font-extrabold text-primary md:text-lg">
            {money(product.price)}
          </span>
          {product.isCustomizable && (
            <span className="hidden text-[11px] font-semibold text-text-muted md:inline">Customizable</span>
          )}
        </div>
      </div>
    </div>
    {open && <CustomizePanel product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
