"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks, site } from "@/lib/data/site";
import { cn } from "@/lib/utils";

export function Navbar() {
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
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6",
          scrolled ? "h-14" : "h-18"
        )}
      >
        <Link href="/" className="flex items-baseline gap-1" aria-label="Axcvia home">
          <span className="text-xl font-extrabold tracking-tight text-navy">AXCVIA</span>
          <span className="size-2 rounded-full bg-teal" aria-hidden />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground"
          >
            <Phone className="size-4 text-teal" aria-hidden />
            {site.phone}
          </a>
          <Button asChild className="bg-teal text-white hover:bg-teal/90">
            <Link href="/contact">Book Free Demo</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-baseline gap-1 text-left">
                <span className="text-lg font-extrabold tracking-tight text-navy">AXCVIA</span>
                <span className="size-1.5 rounded-full bg-teal" aria-hidden />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-4 bg-teal text-white hover:bg-teal/90">
                <Link href="/contact" onClick={() => setOpen(false)}>
                  Book Free Demo
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
