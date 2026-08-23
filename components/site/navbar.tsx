"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone } from "lucide-react";
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
  items: { label: string; href: string }[];
}

const linkCls =
  "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground";

export function Navbar({
  groups = [],
  announcement,
}: {
  groups?: NavGroup[];
  announcement?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-background/90 backdrop-blur-md transition-all duration-300",
        scrolled && "shadow-sm"
      )}
    >
      {announcement && (
        <p className="bg-navy-deep px-4 py-1.5 text-center text-xs font-medium text-white">{announcement}</p>
      )}
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6",
          scrolled ? "h-14" : "h-18"
        )}
      >
        <Link href="/" className="flex items-center" aria-label="Axcvia home">
          <Image
            src="/logo.png"
            alt="Axcvia — Learn. Build. Succeed."
            width={608}
            height={410}
            preload
            className={cn(
              "w-auto transition-all duration-300",
              scrolled ? "h-10" : "h-12"
            )}
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {[...navLinks.slice(0, 1)].map((link) => (
            <Link key={link.href} href={link.href} className={linkCls}>
              {link.label}
            </Link>
          ))}
          {[...groups, { label: "More", items: moreLinks }].map((g) => (
            <div key={g.label} className="group relative">
              <button type="button" className={`${linkCls} flex items-center gap-1`}>
                {g.label} <ChevronDown className="size-3.5 opacity-60" aria-hidden />
              </button>
              <div className="invisible absolute left-0 top-full z-50 min-w-52 rounded-lg border bg-background p-1.5 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {g.items.map((item) => (
                  <Link key={item.href} href={item.href} className="block whitespace-nowrap rounded-md px-3 py-2 text-sm hover:bg-accent">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {navLinks.slice(1).map((link) => (
            <Link key={link.href} href={link.href} className={linkCls}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-md p-2 text-sm font-medium text-foreground/70 hover:text-foreground"
            aria-label={`Call ${site.phone}`}
          >
            <Phone className="size-4 text-teal" aria-hidden />
            <span className="hidden xl:inline">{site.phone}</span>
          </a>
          <CartIcon />
          <StudentNav />
          <Button asChild className="ml-1 whitespace-nowrap bg-teal text-white hover:bg-teal/90">
            <Link href="/contact">Book Free Demo</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
        <CartIcon />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left">
                <Image
                  src="/logo.png"
                  alt="Axcvia — Learn. Build. Succeed."
                  width={608}
                  height={410}
                  className="h-12 w-auto"
                />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 overflow-y-auto px-4" aria-label="Mobile">
              {groups.map((g) => (
                <div key={g.label} className="mt-1">
                  <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</p>
                  {g.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
              {[...navLinks, ...moreLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}
              <StudentNav mobile onNavigate={() => setOpen(false)} />
              <Button asChild className="mt-2 bg-teal text-white hover:bg-teal/90">
                <Link href="/contact" onClick={() => setOpen(false)}>
                  Book Free Demo
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
