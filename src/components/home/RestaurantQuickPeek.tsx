"use client";

import { SafeImage as Image } from "@/components/ui/SafeImage";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { useSnackbar } from "@/context/SnackbarContext";
import type { RestaurantModel } from "@/data/models";
import { cn } from "@/lib/utils";

/** Mirrors `restaurant_quick_peek_sheet.dart`. */
export function RestaurantQuickPeek({
  restaurant,
  onClose,
}: {
  restaurant: RestaurantModel | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const snack = useSnackbar();
  if (!restaurant) return null;

  return (
    <BottomSheet open onClose={onClose} className="!bg-bg">
      <div className="px-5 pb-1">
        <div className="flex items-start gap-2.5">
          <span className="relative h-[50px] w-[50px] shrink-0 overflow-hidden rounded-[12px]">
            <Image
              src={restaurant.image}
              alt=""
              fill
              sizes="50px"
              className="object-cover"
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="flex-1 truncate text-base font-extrabold text-text">
                {restaurant.name}
              </h3>
              <span
                className={cn(
                  "rounded-full px-2.5 py-[3px] text-[10px] font-bold text-white",
                  restaurant.isOpen ? "bg-green" : "bg-text/55",
                )}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </span>
            </div>
            <p className="mt-0.5 flex items-start gap-1 text-xs text-text-muted">
              <Icon name="map-point-bold" size={13} className="mt-0.5" />
              {restaurant.address}
            </p>
          </div>
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-text">
          <Icon name="star-bold" size={13} className="text-amber" />
          {restaurant.rating} ({restaurant.reviews})
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ActionButton
            label="Directions"
            image="/images/google-maps.png"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`,
                "_blank",
              )
            }
          />
          <ActionButton
            label="Call"
            icon="phone-calling-outline"
            onClick={() => (window.location.href = `tel:${restaurant.phone}`)}
          />
          <ActionButton
            label="Share"
            icon="share-outline"
            onClick={() => {
              const url = `${window.location.origin}/restaurant/${restaurant.id}`;
              if (navigator.share) {
                navigator.share({ title: restaurant.name, url }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(url);
                snack.show("Link copied", "success");
              }
            }}
          />
        </div>
        <Button
          title="View more"
          className="mt-3"
          onClick={() => {
            onClose();
            router.push(`/restaurant/${restaurant.id}`);
          }}
        />
      </div>
    </BottomSheet>
  );
}

/** Mirrors `restaurant_action_button.dart`. */
export function ActionButton({
  label,
  icon,
  image,
  onClick,
}: {
  label: string;
  icon?: string;
  image?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 rounded-[12px] border border-border bg-card py-2.5 text-xs font-semibold text-text"
    >
      {image ? (
        <Image src={image} alt="" width={16} height={16} />
      ) : (
        icon && <Icon name={icon} size={16} className="text-primary" />
      )}
      {label}
    </button>
  );
}
