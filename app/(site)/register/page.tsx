import { redirect } from "next/navigation";
import { safeNext } from "@/lib/student/auth";

// Accounts are created on first Google sign-in, so /register just forwards to /login.
export default async function Page({ searchParams }: PageProps<"/register">) {
  const { next } = await searchParams;
  redirect(`/login?next=${encodeURIComponent(safeNext(next))}`);
}
