import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/site/auth-card";
import { getCurrentStudent } from "@/lib/student/auth";

export const metadata: Metadata = { title: "Sign In", robots: { index: false } };

export default async function Page({ searchParams }: PageProps<"/login">) {
  const { next, error } = await searchParams;
  const nextPath = typeof next === "string" && next.startsWith("/") ? next : "/dashboard";
  if (await getCurrentStudent()) redirect(nextPath);
  return <AuthCard mode="login" next={nextPath} error={typeof error === "string" ? error : undefined} />;
}
