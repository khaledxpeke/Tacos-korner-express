"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { SafeImage } from "@/components/ui/SafeImage";
import { useSnackbar } from "@/context/SnackbarContext";
import type { ProductModel } from "@/data/models";
import { cn } from "@/lib/utils";

/** Mirrors `product_hero_widget.dart`: 260px image with back / heart / share round buttons. */
export function ProductHero({
  product,
  isFav,
  onFavToggle,
  height = 260,
}: {
  product: ProductModel;
  isFav: boolean;
  onFavToggle: () => void;
  height?: number;
}) {
  const router = useRouter();
  const snack = useSnackbar();

  return (
    <div className="relative w-full" style={{ height }}>
      <SafeImage
        src={product.image}
        alt={product.name}
        fill
        priority
        sizes="(max-width: 640px) 100vw, 600px"
        className="object-cover"
      />
      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <RoundButton
          icon="alt-arrow-left-outline"
          label="Back"
          onClick={() => (window.history.length > 1 ? router.back() : router.push("/home"))}
          className="rtl:[&_svg]:rotate-180"
        />
        <div className="flex gap-2">
          <RoundButton
            icon="heart-bold"
            label="Favorite"
            onClick={onFavToggle}
            iconClass={isFav ? "text-danger" : undefined}
          />
          <RoundButton
            icon="share-outline"
            label="Share"
            onClick={() => {
              const text = `Check out ${product.name} on Takos Korner Express!`;
              if (navigator.share) navigator.share({ text, url: window.location.href }).catch(() => {});
              else {
                navigator.clipboard?.writeText(window.location.href);
                snack.show("Link copied", "success");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function RoundButton({
  icon,
  label,
  onClick,
  iconClass,
  className,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  iconClass?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-card/90 text-text shadow-card backdrop-blur",
        className,
      )}
    >
      <Icon name={icon} size={18} className={iconClass} />
    </button>
  );
}
