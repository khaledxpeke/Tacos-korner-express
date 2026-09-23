"use client";

import type { CategoryModel } from "@/data/models";
import { cn } from "@/lib/utils";

/** Mirrors `category_card.dart`. */
export function CategoryCard({
  category,
  active,
  onClick,
}: {
  category: CategoryModel;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex shrink-0 flex-col items-center rounded-[14px] border px-3 py-2 shadow-card transition-colors duration-200 md:w-full md:rounded-2xl md:px-2 md:py-4 md:shadow-none md:hover:-translate-y-0.5 md:hover:shadow-card",
        active ? "border-primary bg-primary" : "border-border bg-card md:hover:border-primary",
      )}
    >
      <span className="text-[22px] leading-none md:text-[34px]">{category.icon}</span>
      <span
        className={cn(
          "mt-1 w-12 truncate text-[10px] font-semibold md:mt-2 md:w-full md:text-sm",
          active ? "text-white" : "text-text-body",
        )}
      >
        {category.name}
      </span>
    </button>
  );
}
