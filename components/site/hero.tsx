import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Braces, PlayCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// Rendered on the server with no entrance animation, so the headline, search
// and image are visible immediately — on slow phones and to crawlers.
export function Hero({ categories = [] }: { categories?: { name: string; href: string }[] }) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-secondary via-secondary/40 to-background pb-14 pt-24 sm:pb-20 sm:pt-28">
      <div aria-hidden className="absolute -right-40 -top-40 size-136 rounded-full bg-teal-bright/15 blur-3xl" />
      <div aria-hidden className="absolute -left-40 top-1/2 size-104 rounded-full bg-navy/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-background px-3.5 py-1.5 text-xs font-semibold text-teal shadow-xs sm:text-sm">
            <span className="size-2 rounded-full bg-teal-bright" aria-hidden />
            Live online classes · Small batches · Placement support
          </p>

          <h1 className="mt-5 text-[2.35rem] font-extrabold leading-[1.08] text-navy sm:text-5xl xl:text-[3.5rem]">
            Learn to code.
            <br />
            Build real projects.
            <br />
            <span className="bg-linear-to-r from-teal to-teal-bright bg-clip-text text-transparent">Get hired.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Live, instructor-led programming training with hands-on projects, expert mentors and career
            support from day one — join from anywhere in India.
          </p>

          <form
            action="/courses"
            role="search"
            className="mt-7 flex max-w-xl items-center gap-2 rounded-full border bg-background p-1.5 shadow-lg shadow-navy/5 focus-within:border-teal"
          >
            <Search className="ml-3 size-5 shrink-0 text-muted-foreground" aria-hidden />
            <input
              type="search"
              name="q"
              placeholder="What do you want to learn?"
              aria-label="Search courses"
              className="h-10 min-w-0 flex-1 bg-transparent text-[0.95rem] outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" className="h-10 rounded-full bg-navy px-5 text-white hover:bg-navy/90">
              Search
            </Button>
          </form>

          {categories.length > 0 && (
            <div className="mt-4 flex max-w-xl flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Popular:</span>
              {categories.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="rounded-full border bg-background px-3 py-1 font-medium text-foreground/80 transition-colors hover:border-teal/40 hover:text-teal"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-teal text-white hover:bg-teal/90">
              <Link href="/courses">
                Explore courses <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-navy/20 text-navy">
              <Link href="/contact">
                <PlayCircle className="size-4 text-teal" aria-hidden /> Book a free demo class
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-2xl shadow-navy/20 ring-1 ring-navy/10">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=75"
              alt="Students learning to code together at Axcvia"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-tr from-navy/35 via-transparent to-transparent" />
          </div>

          <div className="absolute -left-3 top-6 hidden items-center gap-2.5 rounded-xl border bg-background/95 px-4 py-3 shadow-lg backdrop-blur sm:flex lg:-left-8">
            <div className="flex size-9 items-center justify-center rounded-lg bg-teal/10">
              <Braces className="size-4.5 text-teal" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold text-navy">Project-first</p>
              <p className="text-xs text-muted-foreground">Real apps, not slides</p>
            </div>
          </div>

          <div className="absolute -bottom-5 right-4 hidden items-center gap-2.5 rounded-xl border bg-background/95 px-4 py-3 shadow-lg backdrop-blur sm:flex lg:right-8">
            <div className="flex size-9 items-center justify-center rounded-lg bg-teal-bright/15">
              <BadgeCheck className="size-4.5 text-teal" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold text-navy">Capstone projects</p>
              <p className="text-xs text-muted-foreground">Evaluated by your trainer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
