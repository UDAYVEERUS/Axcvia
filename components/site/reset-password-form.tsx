"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function ResetPasswordForm({ token, linkError }: { token: string; linkError: string }) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newPassword = String(data.get("password") ?? "");
    if (newPassword !== String(data.get("confirm") ?? "")) {
      setError("Both passwords must match.");
      return;
    }
    setPending(true);
    setError("");
    const { error } = await authClient.resetPassword({ newPassword, token });
    setPending(false);
    if (error) setError(error.message ?? "That link is invalid or has expired. Please request a new one.");
    else setDone(true);
  }

  const badLink = !token || linkError;

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pb-16 pt-28 sm:px-6">
      <div className="rounded-2xl border bg-card p-6 shadow-xl shadow-navy/5 sm:p-8">
        {badLink ? (
          <div className="text-center">
            <ShieldAlert className="mx-auto size-10 text-destructive" aria-hidden />
            <h1 className="mt-4 text-xl font-extrabold text-navy">This link has expired</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Password reset links are valid for one hour and can be used once. Request a fresh one and we&apos;ll email it straight away.
            </p>
            <Button asChild size="lg" className="mt-6 w-full bg-teal text-white hover:bg-teal/90">
              <Link href="/forgot-password">Send a new link</Link>
            </Button>
          </div>
        ) : done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto size-10 text-teal" aria-hidden />
            <h1 className="mt-4 text-xl font-extrabold text-navy">Password updated</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              You can now sign in with your new password.
            </p>
            <Button asChild size="lg" className="mt-6 w-full bg-teal text-white hover:bg-teal/90">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-extrabold text-navy">Set a new password</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Choose a password of at least 8 characters. You&apos;ll use it to sign in from now on.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-password">New password</Label>
                <Input id="reset-password" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-confirm">Confirm new password</Label>
                <Input id="reset-confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" />
              </div>
              {error && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" size="lg" disabled={pending} className="w-full bg-teal text-white hover:bg-teal/90">
                {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                Update password
              </Button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
