"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { site } from "@/lib/data/site";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim().toLowerCase();
    setPending(true);
    setError("");
    const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    setPending(false);
    // The API answers the same way whether or not the address is registered,
    // so the form can't be used to find out who has an account.
    if (error) setError(error.message ?? "Could not send the reset link. Please try again.");
    else setSent(true);
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pb-16 pt-28 sm:px-6">
      <div className="rounded-2xl border bg-card p-6 shadow-xl shadow-navy/5 sm:p-8">
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto size-10 text-teal" aria-hidden />
            <h1 className="mt-4 text-xl font-extrabold text-navy">Check your email</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If that address has an Axcvia account, we&apos;ve sent a link to choose a new password. It expires in one hour.
            </p>
            <ul className="mt-5 space-y-2 text-left text-sm text-foreground/80">
              <li className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden /> Check your spam folder if it hasn&apos;t arrived in a few minutes.</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden /> Signed up with Google? Use &ldquo;Continue with Google&rdquo; instead — there&apos;s no password to reset.</li>
            </ul>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-extrabold text-navy">Forgot your password?</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Enter the email you registered with and we&apos;ll send you a link to set a new password.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input id="forgot-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
              </div>
              {error && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" size="lg" disabled={pending} className="w-full bg-teal text-white hover:bg-teal/90">
                {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                Send reset link
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Still stuck? Call us on{" "}
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="underline hover:text-navy">{site.phone}</a>.
            </p>
          </>
        )}
      </div>
      <Link href="/login" className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-navy">
        <ArrowLeft className="size-4" aria-hidden /> Back to sign in
      </Link>
    </section>
  );
}
