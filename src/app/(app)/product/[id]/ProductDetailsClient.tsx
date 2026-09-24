"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { PageFooter } from "@/components/layout/Page";
import { ReviewCard } from "@/components/restaurant/ReviewCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge, QtyStepper, Stars } from "@/components/ui/Misc";
import { SafeImage } from "@/components/ui/SafeImage";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { productsOfRestaurant, restaurantOf } from "@/data/home";
import type { ProductModel } from "@/data/models";
import { reviewsOf } from "@/data/reviews";
import { cn, money } from "@/lib/utils";
import { ProductCard } from "@/components/home/ProductCard";

/** Mirrors `product_details_screen.dart`. Desktop: image left, details right. */
export function ProductDetailsClient({ product }: { product: ProductModel }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isProductFavorite, toggleProduct } = useFavorites();
  const snack = useSnackbar();
  const [qty, setQty] = useState(1);

  const restaurant = restaurantOf(product);
  const reviews = reviewsOf(restaurant.id).slice(0, 3);
  const more = productsOfRestaurant(restaurant.id).filter((p) => p.id !== product.id).slice(0, 5);
  const isFav = isProductFavorite(product.name);

  function add() {
    addItem({
      id: product.name,
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.image,
      restaurantName: restaurant.name,
      quantity: qty,
      customizations: [],
    });
    snack.show(`${product.name} added to cart`, "success");
  }

  const share = () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: product.name, url }).catch(() => {});
    else {
      navigator.clipboard?.writeText(url);
      snack.show("Link copied", "success");
    }
  };

  const total = product.price * qty;

  return (
    <>
      <div className="relative h-56 w-full md:hidden">
        <SafeImage
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <main className="flex-1">
        <Container className="py-5 md:py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <nav className="flex items-center gap-2 text-sm text-text-muted">
              <Link href="/home" className="hover:text-primary">Home</Link>
              <Icon name="alt-arrow-right-outline" size={14} className="rtl:rotate-180" />
              <Link href={`/restaurant/${restaurant.id}`} className="hover:text-primary">
                {restaurant.name}
              </Link>
              <Icon name="alt-arrow-right-outline" size={14} className="hidden rtl:rotate-180 md:inline" />
              <span className="hidden text-text md:inline">{product.name}</span>
            </nav>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleProduct(product.name)}
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

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr]">
            {/* Desktop image */}
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[24px] md:block">
              <SafeImage
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="600px"
                className="object-cover"
              />
              {product.isNew && (
                <span className="absolute start-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                  NEW
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="muted">{product.category}</Badge>
                {product.isNew && <Badge>NEW</Badge>}
                {product.isCustomizable && (
                  <Badge tone="amber">
                    <Icon name="tuning-2-bold" size={11} /> Customizable
                  </Badge>
                )}
              </div>
              <h1 className="mt-2 text-2xl font-extrabold text-text md:text-3xl">{product.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 font-semibold text-text">
                  <Icon name="star-bold" size={16} className="text-amber" />
                  {product.rating}
                  <span className="font-normal text-text-muted">({product.reviews} reviews)</span>
                </span>
                <span className="text-text-muted">·</span>
                <span className="flex items-center gap-1 text-text-muted">
                  <Icon name="clock-circle-outline" size={14} />
                  {restaurant.deliveryTime}
                </span>
              </div>
              <p className="mt-3 text-3xl font-extrabold text-primary">{money(product.price)}</p>

              <p className="mt-5 text-sm leading-relaxed text-text-body">{product.description}</p>

              {product.allergens.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-bold tracking-wide text-text-muted">ALLERGENS</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.allergens.map((a) => (
                      <span
                        key={a}
                        className="flex items-center gap-1 rounded-full bg-warning-bg px-3 py-1 text-xs font-semibold text-warning"
                      >
                        <Icon name="danger-triangle-bold" size={12} />
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-6 text-xs font-bold tracking-wide text-text-muted">AVAILABLE AT</p>
              <Link
                href={`/restaurant/${restaurant.id}`}
                className="mt-2 flex items-center gap-3 rounded-card border-[0.5px] border-border bg-card p-3 shadow-card"
              >
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[10px]">
                  <SafeImage src={restaurant.image} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-text">{restaurant.name}</span>
                  <span className="flex items-center gap-1 truncate text-xs text-text-muted">
                    <Icon name="map-point-bold" size={11} />
                    {restaurant.zone} · {restaurant.cuisine}
                  </span>
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-text">
                  <Icon name="star-bold" size={12} className="text-amber" />
                  {restaurant.rating}
                </span>
                <Icon name="alt-arrow-right-outline" size={18} className="text-text-muted rtl:rotate-180" />
              </Link>

              {/* Desktop add-to-cart */}
              <div className="mt-6 hidden items-center gap-4 rounded-card border-[0.5px] border-border bg-card p-4 shadow-card md:flex">
                {product.isCustomizable ? (
                  <Button
                    title="Build it your way"
                    icon="tuning-2-bold"
                    onClick={() => router.push(`/product/${product.id}/customize`)}
                  />
                ) : (
                  <>
                    <QtyStepper value={qty} onChange={setQty} />
                    <Button
                      title={`Add to Cart · ${money(total)}`}
                      icon="cart-large-2-bold"
                      onClick={add}
                      className="flex-1"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {reviews.length > 0 && (
            <section className="mt-8 md:mt-12">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-text md:text-xl md:font-extrabold">
                  Reviews for {restaurant.name}
                </h2>
                <Link
                  href={`/restaurant/${restaurant.id}/reviews`}
                  className="text-xs font-semibold text-primary md:text-sm"
                >
                  See all
                </Link>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-3xl font-extrabold text-text">{restaurant.rating}</span>
                <div>
                  <Stars rating={restaurant.rating} size={14} />
                  <p className="text-xs text-text-muted">{restaurant.reviews} ratings</p>
                </div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} compact />
                ))}
              </div>
            </section>
          )}

          {more.length > 0 && (
            <section className="mt-8 md:mt-12">
              <h2 className="text-base font-bold text-text md:text-xl md:font-extrabold">
                More from {restaurant.name}
              </h2>
              <div className="no-scrollbar -mx-5 mt-3 flex gap-2.5 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:px-0 lg:grid-cols-4">
                {more.map((p, i) => (
                  <ProductCard key={p.id} product={p} eager={i === 0} />
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>

      <PageFooter>
        {product.isCustomizable ? (
          <Button
            title="Build it your way"
            icon="tuning-2-bold"
            onClick={() => router.push(`/product/${product.id}/customize`)}
          />
        ) : (
          <div className="flex items-center gap-3">
            <QtyStepper value={qty} onChange={setQty} />
            <Button
              title={`Add to Cart · ${money(total)}`}
              icon="cart-large-2-bold"
              onClick={add}
              className="flex-1"
            />
          </div>
        )}
      </PageFooter>
    </>
  );
}
