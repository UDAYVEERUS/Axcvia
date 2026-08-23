"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "@/components/site/course-card";
import type { Course, CourseType } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";

type SortKey = "newest" | "popular" | "price-asc" | "price-desc";
type TypeFilter = "all" | CourseType;

const TYPE_TABS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "classes", label: "Courses" },
  { value: "mock-test", label: "Mock Test Series" },
  { value: "webinar", label: "Webinars" },
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function sortCourses(list: Course[], sort: SortKey) {
  return list.toSorted((a, b) => {
    switch (sort) {
      case "popular":
        return b.learners - a.learners || b.rating - a.rating;
      case "price-asc":
        return a.discountFee - b.discountFee;
      case "price-desc":
        return b.discountFee - a.discountFee;
      default:
        return 0; // keep server order (newest first)
    }
  });
}

const typeOf = (c: Course): CourseType => c.type ?? "classes";

export function CourseCatalog(props: { courses: Course[]; fixedType?: CourseType }) {
  return (
    <Suspense fallback={<CatalogInner {...props} syncUrl={false} />}>
      <UrlSyncedCatalog {...props} />
    </Suspense>
  );
}

function UrlSyncedCatalog(props: { courses: Course[]; fixedType?: CourseType }) {
  const params = useSearchParams();
  const t = params.get("type");
  const initialType: TypeFilter =
    props.fixedType ?? (t === "classes" || t === "mock-test" || t === "webinar" ? t : "all");
  return (
    <CatalogInner
      {...props}
      syncUrl
      initialType={initialType}
      initialCategory={params.get("category") ?? "all"}
      initialQuery={params.get("q") ?? ""}
    />
  );
}

function CatalogInner({
  courses,
  fixedType,
  syncUrl,
  initialType = fixedType ?? "all",
  initialCategory = "all",
  initialQuery = "",
}: {
  courses: Course[];
  fixedType?: CourseType;
  syncUrl: boolean;
  initialType?: TypeFilter;
  initialCategory?: string;
  initialQuery?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<TypeFilter>(initialType);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<SortKey>("newest");

  // Categories available for the selected type (A320, CPL, ATPL… as on the WP site).
  const categories = useMemo(() => {
    const pool = courses.filter((c) => type === "all" || typeOf(c) === type);
    const counts = new Map<string, number>();
    for (const c of pool) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, slug: slugify(name), count }));
  }, [courses, type]);

  // Reset category when it no longer exists under the selected type.
  useEffect(() => {
    if (category !== "all" && !categories.some((c) => c.slug === category)) {
      const id = setTimeout(() => setCategory("all"), 0);
      return () => clearTimeout(id);
    }
  }, [categories, category]);

  // Keep the URL shareable (/courses?type=mock-test&category=a320).
  useEffect(() => {
    if (!syncUrl) return;
    const sp = new URLSearchParams();
    if (!fixedType && type !== "all") sp.set("type", type);
    if (category !== "all") sp.set("category", category);
    if (query.trim()) sp.set("q", query.trim());
    const qs = sp.toString();
    const target = qs ? `${pathname}?${qs}` : pathname;
    if (target !== `${window.location.pathname}${window.location.search}`) {
      router.replace(target, { scroll: false });
    }
  }, [syncUrl, fixedType, type, category, query, pathname, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = courses.filter((c) => {
      if (type !== "all" && typeOf(c) !== type) return false;
      if (category !== "all" && slugify(c.category) !== category) return false;
      if (q && !`${c.title} ${c.category} ${c.tagline} ${(c.tags ?? []).join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
    return sortCourses(list, sort);
  }, [courses, query, type, category, sort]);

  const noun = type === "mock-test" ? "test series" : type === "webinar" ? "webinar" : "course";

  return (
    <div>
      {/* Filter toolbar */}
      <div className="sticky top-16 z-30 rounded-2xl border bg-card/95 p-4 shadow-sm backdrop-blur-md sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${noun}s…`}
              className="pl-9"
              aria-label="Search"
            />
          </div>
          {!fixedType && (
            <Tabs value={type} onValueChange={(v) => setType(v as TypeFilter)}>
              <TabsList className="flex-wrap">
                {TYPE_TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          <div className="flex items-center gap-3 lg:ml-auto">
            <p className="whitespace-nowrap text-sm text-muted-foreground">
              <span className="font-semibold text-navy">{filtered.length}</span> {noun}
              {filtered.length === 1 || noun.endsWith("series") ? "" : "s"}
            </p>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-44" aria-label="Sort">
                <SelectValue placeholder="Newest" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {categories.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2 border-t pt-3" role="group" aria-label="Filter by category">
            {[{ name: "All", slug: "all", count: 0 }, ...categories].map((cat) => {
              const active = category === cat.slug;
              return (
                <button key={cat.slug} type="button" onClick={() => setCategory(cat.slug)}>
                  <Badge
                    variant={active ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-3 py-1.5 text-sm transition-colors",
                      active ? "bg-navy hover:bg-navy" : "hover:border-teal/50 hover:text-teal"
                    )}
                  >
                    {cat.name}
                    {cat.count > 0 && <span className={cn("ml-1.5 text-xs", active ? "text-white/70" : "text-muted-foreground")}>{cat.count}</span>}
                  </Badge>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed bg-card p-12 text-center">
          <SearchX className="mx-auto size-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 text-lg font-semibold text-navy">Nothing matches your filters</p>
          <p className="mt-2 text-sm text-muted-foreground">Try a different search term or clear the category filter.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
