import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";

export type AdminCheck =
  | { status: "ok"; userId: string; email: string; name: string }
  | { status: "signed-out" }
  | { status: "forbidden"; email: string };

/**
 * Authorization for the admin area: the signed-in user must have the "admin"
 * role and not be banned. Reads the session straight from the database
 * (cookie cache bypassed) so a demotion or ban takes effect immediately.
 */
export const checkAdmin = cache(async (): Promise<AdminCheck> => {
  if (!isDbConfigured()) return { status: "signed-out" };
  const session = await auth.api
    .getSession({ headers: await headers(), query: { disableCookieCache: true } })
    .catch(() => null);
  if (!session) return { status: "signed-out" };
  const roles = String(session.user.role ?? "").split(",").map((r) => r.trim());
  if (!roles.includes("admin") || session.user.banned) return { status: "forbidden", email: session.user.email };
  return { status: "ok", userId: session.user.id, email: session.user.email, name: session.user.name };
});

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await checkAdmin()).status === "ok";
}

/** Call at the top of every admin page and Server Action. */
export async function requireAdmin(): Promise<Extract<AdminCheck, { status: "ok" }>> {
  const check = await checkAdmin();
  if (check.status === "signed-out") redirect("/admin/login");
  if (check.status === "forbidden") redirect("/admin/login?error=forbidden");
  return check;
}
