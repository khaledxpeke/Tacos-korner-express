"use client";

import { SafeImage as Image } from "@/components/ui/SafeImage";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { restaurantOf } from "@/data/home";
import type { ProductModel } from "@/data/models";
import { cn, money } from "@/lib/utils";

/**
 * Mirrors `product_card.dart`: NEW badge, restaurant pill, heart, quick add / Build.
 * 146px tile in phone carousels; fills its grid cell on desktop or when `grid` is set.
 */
export function ProductCard({
  product,
  grid,
  className,
}: {
  product: ProductModel;
  grid?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isProductFavorite, toggleProduct } = useFavorites();
  const snack = useSnackbar();
  const restaurant = restaurantOf(product);
  const isFav = isProductFavorite(product.name);

  const open = () =>
    router.push(
      product.isCustomizable
        ? `/product/${product.id}/customize`
        : `/product/${product.id}`,
    );

  function quickAdd() {
    addItem({
      id: product.name,
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.image,
      restaurantName: restaurant.name,
      quantity: 1,
      customizations: [],
    });
    snack.show(`${product.name} added to cart`, "success");
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
      className={cn(
        "group flex shrink-0 cursor-pointer flex-col overflow-hidden rounded-card border-[0.5px] border-border bg-card text-start shadow-card transition hover:-translate-y-0.5 hover:shadow-lg md:rounded-2xl",
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
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            toggleProduct(product.name);
            snack.show(
              !isFav
                ? `${product.name} added to favorites`
                : `${product.name} removed from favorites`,
              "info",
            );
          }}
          className="absolute end-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-card/90 shadow-card md:h-8 md:w-8"
        >
          <Icon
            name="heart-bold"
            size={15}
            className={isFav ? "text-danger" : "text-text-muted-light"}
          />
        </button>
        {product.isNew && (
          <span className="absolute start-1.5 top-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold text-white md:px-2 md:text-[10px]">
            NEW
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/restaurant/${restaurant.id}`);
          }}
          className="absolute bottom-1.5 start-1.5 flex max-w-[calc(100%-12px)] items-center gap-1 rounded-full bg-black/55 px-1.5 py-[3px] text-[8px] font-bold text-white md:px-2 md:py-1 md:text-[10px]"
        >
          <Icon name="shop-bold" size={9} />
          <span className="truncate">{restaurant.name}</span>
        </button>
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
          {product.isCustomizable ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="flex h-[27px] items-center gap-1 rounded-lg border border-amber/50 bg-amber/10 px-2 text-[10px] font-bold text-amber md:h-8 md:px-3 md:text-xs"
            >
              <Icon name="tuning-2-bold" size={11} />
              Build
            </button>
          ) : (
            <button
              type="button"
              aria-label="Add to cart"
              onClick={(e) => {
                e.stopPropagation();
                quickAdd();
              }}
              className="grid h-[27px] w-[27px] place-items-center rounded-lg bg-primary text-white md:h-8 md:w-8"
            >
              <Icon name="add-circle-bold" size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
