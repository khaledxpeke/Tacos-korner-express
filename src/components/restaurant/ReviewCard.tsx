"use client";

import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Misc";
import type { ReviewModel } from "@/data/models";
import { cn, timeAgo } from "@/lib/utils";

const NOW = new Date("2026-07-22T12:00:00");

/** Review with optional owner reply. Mirrors the review tile in `restaurant_reviews_screen.dart`. */
export function ReviewCard({
  review,
  compact,
  className,
}: {
  review: ReviewModel;
  compact?: boolean;
  className?: string;
}) {
  const initials = review.authorName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2);

  return (
    <article
      className={cn(
        "rounded-card border-[0.5px] border-border bg-card p-4 shadow-card",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-bg text-sm font-bold text-primary">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-text">{review.authorName}</p>
          <div className="flex items-center gap-2">
            <Stars rating={review.rating} size={12} />
            <span className="text-[11px] text-text-muted">{timeAgo(new Date(review.date), NOW)}</span>
          </div>
        </div>
      </div>
      <p className={cn("mt-3 text-sm text-text-body", compact && "line-clamp-3")}>{review.comment}</p>
      {review.ownerReplyText && !compact && (
        <div className="mt-3 rounded-[12px] bg-card-gray p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold text-text">
            <Icon name="shop-bold" size={13} className="text-primary" />
            Owner reply
            {review.ownerReplyDate && (
              <span className="font-normal text-text-muted">
                · {timeAgo(new Date(review.ownerReplyDate), NOW)}
              </span>
            )}
          </p>
          <p className="mt-1.5 text-xs text-text-body">{review.ownerReplyText}</p>
        </div>
      )}
    </article>
  );
}

export function RatingSummary({
  rating,
  count,
  reviews,
  className,
}: {
  rating: number;
  count: number;
  reviews: ReviewModel[];
  className?: string;
}) {
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    s,
    n: reviews.filter((r) => r.rating === s).length,
  }));
  const total = reviews.length || 1;
  return (
    <div
      className={cn(
        "flex items-center gap-5",
        className ?? "rounded-card border-[0.5px] border-border bg-card p-4 shadow-card",
      )}
    >
      <div className="text-center">
        <p className="text-4xl font-extrabold text-text">{rating}</p>
        <Stars rating={rating} size={14} className="mt-1" />
        <p className="mt-1 text-xs text-text-muted">{count} ratings</p>
      </div>
      <div className="flex-1">
        {dist.map((d) => (
          <div key={d.s} className="flex items-center gap-2 py-0.5 text-[11px] text-text-muted">
            <span className="w-3 text-end">{d.s}</span>
            <Icon name="star-bold" size={10} className="text-amber" />
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-card-gray">
              <span
                className="block h-full rounded-full bg-amber"
                style={{ width: `${(d.n / total) * 100}%` }}
              />
            </span>
            <span className="w-4">{d.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
