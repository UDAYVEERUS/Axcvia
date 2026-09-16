import Image from "next/image";
import Link from "next/link";
import { Award, ClipboardList, PlayCircle, ShieldCheck } from "lucide-react";
import { GoogleSignInButton } from "@/components/site/google-sign-in-button";

// Better Auth appends `?error=<code>` to the error callback URL.
const messages: Record<string, string> = {
  access_denied: "Google sign-in was cancelled.",
  account_not_linked: "This email is already linked to a different sign-in method. Please contact us.",
  banned: "This account has been suspended. Please contact us.",
};

export function AuthCard({ next, error, configured }: { next: string; error?: string; configured: boolean }) {
  const errorText = error ? (messages[error] ?? "Google sign-in didn't complete. Please try again.") : "";
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 pb-16 pt-28 sm:px-6">
      <div className="rounded-2xl border bg-card p-6 shadow-xl shadow-navy/5 sm:p-8">
        <Image src="/logo.png" alt="Axcvia" width={608} height={410} className="mx-auto h-14 w-auto" />
        <h1 className="mt-5 text-center text-2xl font-extrabold text-navy">Sign in to Axcvia</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          One account for your courses, recordings, mock test results and certificates. New here? Signing in creates your account.
        </p>

        {errorText && (
          <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {errorText}
          </p>
        )}
        {!configured && (
          <p className="mt-5 rounded-lg border bg-secondary p-3 text-sm text-muted-foreground">
            Sign-in isn&apos;t available yet — Google sign-in hasn&apos;t been configured on this server.
          </p>
        )}

        <div className="mt-6">
          <GoogleSignInButton
            callbackURL={next}
            errorCallbackURL={`/login?next=${encodeURIComponent(next)}`}
            disabled={!configured}
          />
        </div>

        <ul className="mt-6 space-y-2.5 border-t pt-5 text-sm text-foreground/80">
          <li className="flex items-center gap-2.5"><PlayCircle className="size-4 text-teal" aria-hidden /> Live classes and recordings in one place</li>
          <li className="flex items-center gap-2.5"><ClipboardList className="size-4 text-teal" aria-hidden /> Mock test scores and explanations</li>
          <li className="flex items-center gap-2.5"><Award className="size-4 text-teal" aria-hidden /> Downloadable certificates</li>
        </ul>
      </div>
      <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 shrink-0 translate-y-px text-teal" aria-hidden />
        <span>
          We never see your Google password. By continuing you agree to our{" "}
          <Link href="/terms-of-service" className="underline hover:text-navy">Terms</Link> and{" "}
          <Link href="/privacy-policy" className="underline hover:text-navy">Privacy Policy</Link>.
        </span>
      </p>
    </section>
  );
}
