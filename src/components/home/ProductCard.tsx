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
      <div className={cn("relative w-full", grid ? "h-28 md:h-52" : "h-20 md:h-52")}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 146px, 300px"
          loading={eager ? "eager" : undefined}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
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
          <span className="absolute end-1.5 top-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold text-white md:px-2 md:text-[10px]">
            NEW
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/restaurant/${restaurant.id}`);
          }}
          className={cn(
            "absolute bottom-1.5 start-1.5 flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-[3px] text-[8px] font-bold text-white md:px-2 md:py-1 md:text-[10px]",
            inCart > 0 ? "max-w-[calc(100%-5.5rem)]" : "max-w-[calc(100%-12px)]",
          )}
        >
          <Icon name="shop-bold" size={9} />
          <span className="truncate">{restaurant.name}</span>
        </button>
        {inCart > 0 && (
          <span className="absolute bottom-1.5 end-1.5 z-10 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-text shadow-md md:px-2.5 md:py-1.5 md:text-xs">
            <Icon name="cart-large-2-bold" size={13} className="text-primary" />
            ×{inCart}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2 md:px-3.5 md:pb-3.5 md:pt-3">
        <p className="line-clamp-2 h-[30px] text-xs font-bold leading-[15px] text-text md:h-auto md:text-base md:font-extrabold md:leading-snug">
          {product.name}
        </p>
        <p className="mt-1 hidden text-xs text-text-muted md:line-clamp-2 md:text-sm">
          {product.description}
        </p>
        <div className="mt-1.5 flex items-center justify-between md:mt-4">
          <span className="text-[13px] font-extrabold text-primary md:text-lg">
            {money(product.price)}
          </span>
          <button
            type="button"
            aria-label={product.isCustomizable ? "Customize" : "Add to cart"}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-lg font-semibold leading-none text-white transition hover:bg-primary-dark md:h-9 md:w-9 md:text-xl"
          >
            +
          </button>
        </div>
      </div>
    </div>
    {open && <CustomizePanel product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
