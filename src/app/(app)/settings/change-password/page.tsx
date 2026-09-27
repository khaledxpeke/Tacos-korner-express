import { redirect } from "next/navigation";

/** Password now lives under Security; keep old links working. */
export default function ChangePasswordRedirect() {
  redirect("/settings/security");
}
