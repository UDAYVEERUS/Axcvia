"use client";

import Link from "next/link";
import { LayoutDashboard, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudent } from "@/components/site/use-student";

export function StudentNav({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { loaded, student } = useStudent();
  if (mobile) {
    return (
      <Button asChild variant="outline" className="mt-3">
        <Link href={student ? "/dashboard" : "/login"} onClick={onNavigate}>{student ? "My Dashboard" : "Log in / Sign up"}</Link>
      </Button>
    );
  }
  if (!loaded) return <span className="inline-block h-8 w-16" aria-hidden />;
  return student ? (
    <Button asChild variant="outline" size="sm"><Link href="/dashboard"><LayoutDashboard className="size-4" aria-hidden /> {student.name.split(" ")[0]}</Link></Button>
  ) : (
    <Button asChild variant="ghost" size="sm"><Link href="/login"><UserRound className="size-4" aria-hidden /> Log in</Link></Button>
  );
}
