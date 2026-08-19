import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "axcvia_admin_session";

// ADMIN_PASSWORD must be set in production. Local development falls back to
// a default so the dashboard is usable out of the box.
export function getAdminPassword(): string | null {
  const configured = process.env.ADMIN_PASSWORD;
  if (configured) return configured;
  return process.env.NODE_ENV === "development" ? "axcvia-admin" : null;
}

export function sessionToken(): string | null {
  const password = getAdminPassword();
  if (!password) return null;
  return createHmac("sha256", password).update("axcvia-admin-session-v1").digest("hex");
}

export function verifyPassword(input: string): boolean {
  const password = getAdminPassword();
  if (!password) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(password);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  // Read cookies first so admin routes always render dynamically,
  // even when no ADMIN_PASSWORD is present at build time.
  const cookieStore = await cookies();
  const token = sessionToken();
  if (!token) return false;
  return cookieStore.get(ADMIN_COOKIE)?.value === token;
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}
