import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/site/auth-card";
import { isGoogleConfigured } from "@/lib/auth";
import { getCurrentStudent, safeNext } from "@/lib/student/auth";

export const metadata: Metadata = { title: "Sign In", robots: { index: false } };

export default async function Page({ searchParams }: PageProps<"/login">) {
  const { next, error } = await searchParams;
  const nextPath = safeNext(next);
  if (await getCurrentStudent()) redirect(nextPath);
  return <AuthCard next={nextPath} error={typeof error === "string" ? error : undefined} configured={isGoogleConfigured()} />;
}
