import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleSignInButton } from "@/components/site/google-sign-in-button";
import { logoutAction } from "@/app/admin/actions";
import { checkAdmin } from "@/lib/admin/auth";
import { isGoogleConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const check = await checkAdmin();
  if (check.status === "ok") redirect("/admin");
  const { error } = await searchParams;
  const configured = isGoogleConfigured();
  const oauthError = typeof error === "string" && error !== "forbidden";

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/60 px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl shadow-navy/5 sm:p-8">
        <Image src="/logo.png" alt="Axcvia" width={608} height={410} className="mx-auto h-12 w-auto" />
        <div className="mt-5 flex items-center justify-center gap-2">
          <ShieldCheck className="size-5 text-teal" aria-hidden />
          <h1 className="text-xl font-extrabold text-navy">Admin dashboard</h1>
        </div>

        {check.status === "forbidden" ? (
          <div className="mt-6 space-y-4">
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              You&apos;re signed in as <strong className="font-semibold">{check.email}</strong>, which doesn&apos;t have admin access. Ask an existing admin to grant it, or switch accounts.
            </p>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="lg" className="w-full">
                Sign out and use another account
              </Button>
            </form>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {oauthError && (
              <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                Google sign-in didn&apos;t complete. Please try again.
              </p>
            )}
            {!configured && (
              <p className="rounded-lg border bg-secondary p-3 text-sm text-muted-foreground">
                Google sign-in isn&apos;t configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the server.
              </p>
            )}
            <GoogleSignInButton callbackURL="/admin" errorCallbackURL="/admin/login" label="Sign in with Google" disabled={!configured} />
            <p className="text-center text-xs text-muted-foreground">Only accounts with the admin role can open the dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
