"use client";

import { Suspense } from "react";
import AuthForm from "@/components/fidelite/AuthForm";

export default function SignupPage() {
  return (
    <Suspense fallback={<p className="px-7 py-16 text-sm text-text-muted">Chargement…</p>}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
