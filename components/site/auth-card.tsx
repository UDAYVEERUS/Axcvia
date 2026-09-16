"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Award, ClipboardList, Loader2, PlayCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/site/google-sign-in-button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

// Better Auth appends `?error=<code>` to the error callback URL.
const oauthMessages: Record<string, string> = {
  access_denied: "Google sign-in was cancelled.",
  account_not_linked: "This email is already registered with a password. Sign in with your password instead.",
  banned: "This account has been suspended. Please contact us.",
};

export function AuthCard({
  next,
  error,
  configured,
  mode: initialMode = "signin",
}: {
  next: string;
  error?: string;
  configured: boolean;
  mode?: "signin" | "register";
}) {
  const [mode, setMode] = useState<"signin" | "register">(initialMode);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState("");
  const oauthError = error ? (oauthMessages[error] ?? "Google sign-in didn't complete. Please try again.") : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "");
    setPending(true);
    setFormError("");

    const result =
      mode === "register"
        ? await authClient.signUp.email({
            name: String(data.get("name") ?? "").trim(),
            email,
            password,
            phone: String(data.get("phone") ?? "").trim(),
          })
        : await authClient.signIn.email({ email, password });

    if (result.error) {
      setFormError(result.error.message ?? "Something went wrong. Please try again.");
      setPending(false);
      return;
    }
    // Full reload so server components pick up the new session cookie.
    window.location.href = next;
  }

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 pb-16 pt-28 sm:px-6">
      <div className="rounded-2xl border bg-card p-6 shadow-xl shadow-navy/5 sm:p-8">
        <Image src="/logo.png" alt="Axcvia" width={608} height={410} className="mx-auto h-14 w-auto" />

        <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1" role="tablist">
          {(["signin", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setFormError("");
              }}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                mode === m ? "bg-card text-navy shadow-sm" : "text-muted-foreground hover:text-navy"
              )}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "signin"
            ? "Welcome back — sign in to your courses, tests and certificates."
            : "One account for your courses, recordings, mock test results and certificates."}
        </p>

        {oauthError && (
          <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {oauthError}
          </p>
        )}

        <div className="mt-5">
          {configured ? (
            <GoogleSignInButton
              callbackURL={next}
              errorCallbackURL={`/login?next=${encodeURIComponent(next)}`}
              label={mode === "signin" ? "Continue with Google" : "Sign up with Google"}
            />
          ) : (
            <p className="rounded-lg border bg-secondary p-3 text-sm text-muted-foreground">
              Google sign-in isn&apos;t configured on this server — use your email and password below.
            </p>
          )}
        </div>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="auth-name">Full name</Label>
              <Input id="auth-name" name="name" required maxLength={100} autoComplete="name" placeholder="Your name" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input id="auth-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
          </div>
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="auth-phone">Mobile number</Label>
              <Input id="auth-phone" name="phone" type="tel" required maxLength={20} autoComplete="tel" placeholder="+91 XXXXX XXXXX" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder={mode === "register" ? "At least 8 characters" : ""}
            />
          </div>

          {formError && (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" disabled={pending} className="w-full bg-teal text-white hover:bg-teal/90">
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {mode === "signin" ? "Sign in" : "Create my account"}
          </Button>
        </form>

        {mode === "signin" && (
          <p className="mt-3 text-center text-sm">
            <Link href="/forgot-password" className="font-medium text-teal hover:underline">
              Forgot your password?
            </Link>
          </p>
        )}

        <ul className="mt-6 space-y-2.5 border-t pt-5 text-sm text-foreground/80">
          <li className="flex items-center gap-2.5"><PlayCircle className="size-4 text-teal" aria-hidden /> Live classes and recordings in one place</li>
          <li className="flex items-center gap-2.5"><ClipboardList className="size-4 text-teal" aria-hidden /> Mock test scores and explanations</li>
          <li className="flex items-center gap-2.5"><Award className="size-4 text-teal" aria-hidden /> Downloadable certificates</li>
        </ul>
      </div>

      <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 shrink-0 translate-y-px text-teal" aria-hidden />
        <span>
          By continuing you agree to our{" "}
          <Link href="/terms-of-service" className="underline hover:text-navy">Terms</Link> and{" "}
          <Link href="/privacy-policy" className="underline hover:text-navy">Privacy Policy</Link>.
        </span>
      </p>
    </section>
  );
}
