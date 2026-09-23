"use client";

import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { RatingSummary, ReviewCard } from "@/components/restaurant/ReviewCard";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/Dialog";
import { TextArea } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard, SelectableChip } from "@/components/ui/Misc";
import { useSnackbar } from "@/context/SnackbarContext";
import type { RestaurantModel, ReviewModel } from "@/data/models";
import { reviewsOf } from "@/data/reviews";
import { cn } from "@/lib/utils";

type Filter = "all" | 5 | 4 | 3 | 2 | 1;

/** Mirrors `restaurant_reviews_screen.dart`: rating summary, filter chips, review list, write review sheet. */
export function ReviewsClient({ restaurant }: { restaurant: RestaurantModel }) {
  const snack = useSnackbar();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [local, setLocal] = useState<ReviewModel[]>([]);

  const all = [...local, ...reviewsOf(restaurant.id)];
  const list = filter === "all" ? all : all.filter((r) => r.rating === filter);

  function submit() {
    if (text.trim().length < 5) {
      snack.show("Tell us a bit more (5+ characters)", "warning");
      return;
    }
    setLocal((l) => [
      {
        id: Date.now(),
        restaurantId: restaurant.id,
        authorName: "You",
        rating: stars,
        comment: text.trim(),
        date: "2026-07-22",
      },
      ...l,
    ]);
    setText("");
    setOpen(false);
    snack.show("Thanks for your review!", "success");
  }

  return (
    <>
      <BackAppBar
        title="Reviews"
        subtitle={restaurant.name}
        fallbackHref={`/restaurant/${restaurant.id}`}
        trailing={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-bold text-white"
          >
            <Icon name="pen-outline" size={14} />
            Write
          </button>
        }
      />
      <Page className="md:pt-4">
        <RatingSummary rating={restaurant.rating} count={restaurant.reviews} reviews={all} />
        <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
          <SelectableChip label={`All (${all.length})`} selected={filter === "all"} onClick={() => setFilter("all")} />
          {([5, 4, 3, 2, 1] as const).map((s) => (
            <SelectableChip
              key={s}
              label={`${s} ★`}
              selected={filter === s}
              onClick={() => setFilter(s)}
            />
          ))}
        </div>
        {list.length === 0 ? (
          <EmptyCard
            className="mt-4"
            icon="chat-round-dots-outline"
            title="No reviews here"
            message="Be the first to share your experience."
          />
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </Page>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Write a review">
        <div className="flex flex-col gap-4 px-5">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                aria-label={`${s} stars`}
                onClick={() => setStars(s)}
                className={cn("transition", s <= stars ? "text-amber" : "text-text-muted-light")}
              >
                <Icon name="star-bold" size={34} />
              </button>
            ))}
          </div>
          <TextArea
            placeholder="What did you like? What could be better?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={400}
          />
          <Button title="Submit review" onClick={submit} />
        </div>
      </BottomSheet>
    </>
  );
}
