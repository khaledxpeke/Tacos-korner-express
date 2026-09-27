"use client";

import Image from "next/image";
import { fakeUser } from "@/data/misc";
import { useAvatar } from "@/lib/useAvatar";
import { cn } from "@/lib/utils";

/** The user's photo, or their initials when they removed it. Size comes from `className`. */
export function UserAvatar({
  className,
  sizes = "96px",
  initialsClass = "text-xl",
}: {
  className?: string;
  sizes?: string;
  initialsClass?: string;
}) {
  const [avatar] = useAvatar();
  return (
    <span className={cn("relative block overflow-hidden rounded-full bg-primary-bg", className)}>
      {avatar ? (
        <Image src={avatar} alt="" fill sizes={sizes} unoptimized={avatar.startsWith("data:")} className="object-cover" />
      ) : (
        <span className={cn("grid h-full w-full place-items-center font-extrabold text-primary", initialsClass)}>
          {fakeUser.firstName[0]}
          {fakeUser.lastName[0]}
        </span>
      )}
    </span>
  );
}
