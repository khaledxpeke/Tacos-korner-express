"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, loyaltyRoutes } from "@/lib/loyalty";

export default function FideliteHomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(getToken() ? loyaltyRoutes.points : loyaltyRoutes.login);
  }, [router]);
  return <p className="px-7 py-16 text-sm text-text-muted">Chargement…</p>;
}
