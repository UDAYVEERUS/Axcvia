import Link from "next/link";
import { Award, ClipboardList, Heart, LayoutDashboard, LogOut, Receipt, UserRound } from "lucide-react";
import { logoutStudentAction } from "@/app/student-actions";
import { requireStudent } from "@/lib/student/auth";

export const dynamic = "force-dynamic";

const items = [
  { href: "/dashboard", label: "My Courses", icon: LayoutDashboard },
  { href: "/dashboard/results", label: "Test Results", icon: ClipboardList },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/orders", label: "Orders", icon: Receipt },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const student = await requireStudent("/dashboard");
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">Student dashboard</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">Hi, {student.name.split(" ")[0]} 👋</h1>
        </div>
        <form action={logoutStudentAction}>
          <button type="submit" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy"><LogOut className="size-4" aria-hidden /> Sign out</button>
        </form>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto lg:flex-col">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-navy">
              <it.icon className="size-4 text-teal" aria-hidden /> {it.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
