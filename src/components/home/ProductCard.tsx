"use client";

import { SafeImage as Image } from "@/components/ui/SafeImage";
import { useRouter } from "next/navigation";
import { FavoriteHeart } from "@/components/ui/FavoriteHeart";
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
          className="group/fav absolute end-2 top-2 drop-shadow-md"
        >
          <FavoriteHeart saved={isFav} />
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
          <button
            type="button"
            aria-label={product.isCustomizable ? "Customize" : "Add to cart"}
            onClick={(e) => {
              e.stopPropagation();
              if (product.isCustomizable) open();
              else quickAdd();
            }}
            className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-lg font-semibold leading-none text-white transition hover:bg-primary-dark md:h-9 md:w-9 md:text-xl"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
