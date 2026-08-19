import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Inbox, LayoutDashboard, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Axcvia Admin" },
  robots: { index: false, follow: false },
};

// Admin pages read live DB state and auth cookies — never prerender them.
export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-navy-deep text-white/80 md:flex">
        <Link href="/admin" className="flex items-baseline gap-1 px-6 py-5">
          <span className="text-lg font-extrabold tracking-tight text-white">AXCVIA</span>
          <span className="size-1.5 rounded-full bg-teal-bright" aria-hidden />
          <span className="ml-1 text-xs font-medium uppercase tracking-wider text-white/50">
            Admin
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Admin">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10 hover:text-white"
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="size-4" aria-hidden /> View Website
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10 hover:text-white"
            >
              <LogOut className="size-4" aria-hidden /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1 bg-secondary/30">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
          <span className="font-bold text-navy">Axcvia Admin</span>
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Button key={item.href} asChild variant="ghost" size="sm">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-6xl p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
