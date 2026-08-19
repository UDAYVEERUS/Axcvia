import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/admin/actions";
import { getAdminPassword, isAdminAuthenticated } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await isAdminAuthenticated()) redirect("/admin");
  const { error } = await searchParams;
  const passwordConfigured = getAdminPassword() !== null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 pt-16">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-navy">
            <ShieldCheck className="size-6 text-teal-bright" aria-hidden />
          </div>
          <CardTitle className="mt-2 text-navy">Axcvia Admin</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to manage courses and leads</p>
        </CardHeader>
        <CardContent>
          {!passwordConfigured ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              ADMIN_PASSWORD is not configured on this server. Set it in your environment
              variables to enable the dashboard.
            </p>
          ) : (
            <form action={loginAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  Incorrect password. Please try again.
                </p>
              )}
              <Button type="submit" className="w-full bg-teal text-white hover:bg-teal/90">
                Sign In
              </Button>
              {process.env.NODE_ENV === "development" && !process.env.ADMIN_PASSWORD && (
                <p className="text-xs text-muted-foreground">
                  Dev default password: <code className="font-mono">axcvia-admin</code> (set
                  ADMIN_PASSWORD to change)
                </p>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
