import { redirect } from "next/navigation";

/** Onboarding now lives on the sign-in panel. Old links land on sign in. */
export default function OnboardingPage() {
  redirect("/login");
}
