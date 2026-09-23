import { cn } from "@/lib/utils";

/** Thick-stroke heart. Outline by default, fills red when saved or hovered. */
export function FavoriteHeart({
  saved,
  size = 22,
  className,
}: {
  saved: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={saved ? "currentColor" : "none"}
      className={cn(
        "shrink-0 text-white transition-colors group-hover/fav:fill-current group-hover/fav:text-danger",
        saved && "text-danger",
        className,
      )}
      aria-hidden
    >
      <path
        d="M12 20.6 4.55 13.5C2.45 11.5 2.55 8.15 5 6.5c1.95-1.3 4.5-.8 6 1.2 1.5-2 4.05-2.5 6-1.2 2.45 1.65 2.55 5 .45 7L12 20.6Z"
        stroke="currentColor"
        strokeWidth={2.75}
        strokeLinejoin="round"
      />
    </svg>
  );
}
