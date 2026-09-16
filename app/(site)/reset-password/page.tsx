import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/site/reset-password-form";

export const metadata: Metadata = { title: "Set a new password", robots: { index: false } };

// Better Auth emails a link to /api/auth/reset-password/<token>?callbackURL=/reset-password,
// which checks the token and redirects here with ?token=… (or ?error=INVALID_TOKEN).
export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token, error } = await searchParams;
  return (
    <ResetPasswordForm
      token={typeof token === "string" ? token : ""}
      linkError={typeof error === "string" ? error : ""}
    />
  );
}
