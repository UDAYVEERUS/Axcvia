"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { CartIcon } from "@/components/site/cart-icon";
import { StudentNav } from "@/components/site/student-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { moreLinks, navLinks, site } from "@/lib/data/site";
import { cn } from "@/lib/utils";

export interface NavGroup {
  label: string;
  /** When set, the group heading itself links here (e.g. "Courses" → /courses). */
  href?: string;
  items: { label: string; href: string }[];
}

/** Course search — submits to the catalog, which reads `?q=`. */
function SearchBox({ className, autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  return (
    <form action="/courses" role="search" className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        type="search"
        name="q"
        placeholder="Search for courses — Java, React, Python…"
        aria-label="Search courses"
        autoFocus={autoFocus}
        className="h-11 w-full rounded-full border border-input bg-secondary/60 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-teal focus:bg-background focus:ring-3 focus:ring-teal/15"
      />
    </form>
  );
}

export function Navbar({
  groups = [],
  announcement,
}: {
  groups?: NavGroup[];
  announcement?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const exploreGroups: NavGroup[] = [...groups, { label: "Institute", items: moreLinks }];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-background/95 backdrop-blur-md transition-shadow duration-300",
        scrolled && "shadow-[0_2px_12px_-4px_rgb(15_44_92/0.15)]"
      )}
    >
      {announcement && (
        <p className="bg-navy px-4 py-1.5 text-center text-xs font-medium text-white">{announcement}</p>
      )}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-5">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Axcvia home">
          <Image
            src="/logo.png"
            alt="Axcvia — Learn. Build. Succeed."
            width={608}
            height={410}
            preload
            className="h-11 w-auto"
          />
        </Link>

        {/* Desktop: Explore mega menu */}
        <div className="group relative hidden lg:block">
          <button
            type="button"
            className="flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-semibold text-foreground/85 transition-colors hover:text-teal"
            aria-haspopup="true"
          >
            Explore <ChevronDown className="size-4 opacity-60 transition-transform group-hover:rotate-180" aria-hidden />
          </button>
          <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
            <div
              className="grid gap-x-8 gap-y-6 rounded-xl border bg-popover p-6 shadow-xl"
              style={{ gridTemplateColumns: `repeat(${Math.min(exploreGroups.length, 4)}, minmax(11rem, 1fr))` }}
            >
              {exploreGroups.map((g) => (
                <div key={g.label}>
                  {g.href ? (
                    <Link href={g.href} className="text-xs font-bold uppercase tracking-wider text-navy hover:text-teal">
                      {g.label}
                    </Link>
                  ) : (
                    <p className="text-xs font-bold uppercase tracking-wider text-navy">{g.label}</p>
                  )}
                  <ul className="mt-3 space-y-0.5">
                    {g.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="-mx-2 block whitespace-nowrap rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-accent hover:text-navy"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SearchBox className="hidden flex-1 lg:block lg:max-w-md xl:max-w-lg" />

        <nav className="ml-auto hidden items-center xl:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-teal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-1.5 lg:flex xl:ml-0">
          <CartIcon />
          <StudentNav />
          <Button asChild className="ml-1 bg-teal text-white hover:bg-teal/90">
            <Link href="/contact">Book Free Demo</Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="ml-auto flex items-center gap-0.5 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label={searchOpen ? "Close search" : "Search courses"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
          </Button>
          <CartIcon />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] gap-0 p-0 sm:max-w-sm">
              <SheetHeader className="border-b">
                <SheetTitle className="text-left">
                  <Image src="/logo.png" alt="Axcvia — Learn. Build. Succeed." width={608} height={410} className="h-10 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-3" aria-label="Mobile">
                {groups.map((g) => (
                  <details key={g.label} className="group border-b py-1" open={g.label === "Courses"}>
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-2.5 text-[0.95rem] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                      {g.label}
                      <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                    </summary>
                    <ul className="pb-2">
                      {g.items.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} onClick={() => setOpen(false)} className="block rounded-md px-4 py-2 text-sm text-foreground/80 hover:bg-accent">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
                <ul className="py-2">
                  {[...navLinks, ...moreLinks].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-2 py-2.5 text-[0.95rem] font-medium text-foreground/85 hover:bg-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="grid gap-2 border-t p-4">
                <StudentNav mobile onNavigate={() => setOpen(false)} />
                <Button asChild size="lg" className="bg-teal text-white hover:bg-teal/90">
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Book Free Demo
                  </Link>
                </Button>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center justify-center gap-2 py-1 text-sm font-medium text-muted-foreground">
                  <Phone className="size-4 text-teal" aria-hidden /> {site.phone}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile search row */}
      {searchOpen && (
        <div className="border-t px-4 py-3 lg:hidden">
          <SearchBox autoFocus />
        </div>
      )}
    </header>
  );
}
