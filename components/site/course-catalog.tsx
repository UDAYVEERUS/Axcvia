"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CourseCard } from "@/components/site/course-card";
import type { Course, CourseType } from "@/lib/types";
import { slugify } from "@/lib/utils";

type SortKey = "newest" | "popular" | "price-asc" | "price-desc";
type TypeFilter = "all" | CourseType;
type Level = Course["level"];

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "classes", label: "Courses" },
  { value: "mock-test", label: "Mock Test Series" },
  { value: "webinar", label: "Webinars" },
];

const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

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
      initialLevels={(params.get("level") ?? "").split(",").filter((l): l is Level => LEVELS.includes(l as Level))}
    />
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 font-heading text-sm font-bold text-navy">{title}</legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

function FilterOption({
  type,
  name,
  checked,
  onChange,
  label,
  count,
}: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md py-1.5 text-sm text-foreground/85 hover:text-navy">
      <input type={type} name={name} checked={checked} onChange={onChange} className="size-4 shrink-0 accent-teal" />
      <span className="min-w-0 flex-1">{label}</span>
      {count !== undefined && <span className="text-xs tabular-nums text-muted-foreground">{count}</span>}
    </label>
  );
}

function CatalogInner({
  courses,
  fixedType,
  syncUrl,
  initialType = fixedType ?? "all",
  initialCategory = "all",
  initialQuery = "",
  initialLevels = [],
}: {
  courses: Course[];
  fixedType?: CourseType;
  syncUrl: boolean;
  initialType?: TypeFilter;
  initialCategory?: string;
  initialQuery?: string;
  initialLevels?: Level[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<TypeFilter>(initialType);
  const [category, setCategory] = useState<string>(initialCategory);
  const [levels, setLevels] = useState<Level[]>(initialLevels);
  const [sort, setSort] = useState<SortKey>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const typePool = useMemo(() => courses.filter((c) => type === "all" || typeOf(c) === type), [courses, type]);

  // Categories available for the selected type, most populated first.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of typePool) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, slug: slugify(name), count }));
  }, [typePool]);

  const typeCounts = useMemo(() => {
    const counts: Record<TypeFilter, number> = { all: courses.length, classes: 0, "mock-test": 0, webinar: 0 };
    for (const c of courses) counts[typeOf(c)]++;
    return counts;
  }, [courses]);

  const levelCounts = useMemo(() => {
    const pool = typePool.filter((c) => category === "all" || slugify(c.category) === category);
    return Object.fromEntries(LEVELS.map((l) => [l, pool.filter((c) => c.level === l).length])) as Record<Level, number>;
  }, [typePool, category]);

  // Reset category when it no longer exists under the selected type.
  useEffect(() => {
    if (category !== "all" && !categories.some((c) => c.slug === category)) {
      const id = setTimeout(() => setCategory("all"), 0);
      return () => clearTimeout(id);
    }
  }, [categories, category]);

  // Keep the URL shareable (/courses?type=mock-test&category=web-development&level=Beginner).
  useEffect(() => {
    if (!syncUrl) return;
    const sp = new URLSearchParams();
    if (!fixedType && type !== "all") sp.set("type", type);
    if (category !== "all") sp.set("category", category);
    if (levels.length) sp.set("level", levels.join(","));
    if (query.trim()) sp.set("q", query.trim());
    const qs = sp.toString();
    const target = qs ? `${pathname}?${qs}` : pathname;
    if (target !== `${window.location.pathname}${window.location.search}`) {
      router.replace(target, { scroll: false });
    }
  }, [syncUrl, fixedType, type, category, levels, query, pathname, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = typePool.filter((c) => {
      if (category !== "all" && slugify(c.category) !== category) return false;
      if (levels.length && !levels.includes(c.level)) return false;
      if (q && !`${c.title} ${c.category} ${c.tagline} ${(c.tags ?? []).join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
    return sortCourses(list, sort);
  }, [typePool, query, category, levels, sort]);

  const noun = type === "mock-test" ? "test series" : type === "webinar" ? "webinar" : "course";
  const toggleLevel = (l: Level) => setLevels((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));
  const clearAll = () => {
    if (!fixedType) setType("all");
    setCategory("all");
    setLevels([]);
    setQuery("");
  };

  const activeChips = [
    ...(!fixedType && type !== "all"
      ? [{ key: "type", label: TYPE_OPTIONS.find((t) => t.value === type)!.label, clear: () => setType("all") }]
      : []),
    ...(category !== "all"
      ? [{ key: "category", label: categories.find((c) => c.slug === category)?.name ?? category, clear: () => setCategory("all") }]
      : []),
    ...levels.map((l) => ({ key: `level-${l}`, label: l, clear: () => toggleLevel(l) })),
  ];

  // Rendered twice (desktop sidebar + mobile sheet), so input names are scoped per instance.
  const filterPanel = (scope: string) => (
    <div className="space-y-7">
      {!fixedType && (
        <FilterGroup title="Type">
          {TYPE_OPTIONS.filter((o) => o.value === "all" || typeCounts[o.value] > 0).map((o) => (
            <FilterOption key={o.value} type="radio" name={`${scope}-type`} checked={type === o.value} onChange={() => setType(o.value)} label={o.label} count={typeCounts[o.value]} />
          ))}
        </FilterGroup>
      )}
      {categories.length > 1 && (
        <FilterGroup title="Category">
          <FilterOption type="radio" name={`${scope}-category`} checked={category === "all"} onChange={() => setCategory("all")} label="All categories" count={typePool.length} />
          {categories.map((c) => (
            <FilterOption key={c.slug} type="radio" name={`${scope}-category`} checked={category === c.slug} onChange={() => setCategory(c.slug)} label={c.name} count={c.count} />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Level">
        {LEVELS.filter((l) => levelCounts[l] > 0 || levels.includes(l)).map((l) => (
          <FilterOption key={l} type="checkbox" name={`${scope}-level`} checked={levels.includes(l)} onChange={() => toggleLevel(l)} label={l} count={levelCounts[l]} />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-24">
          <div className="mb-5 flex items-center justify-between">
            <p className="flex items-center gap-2 font-heading font-bold text-navy">
              <SlidersHorizontal className="size-4" aria-hidden /> Filters
            </p>
            {activeChips.length > 0 && (
              <button type="button" onClick={clearAll} className="text-xs font-semibold text-teal hover:underline">
                Clear all
              </button>
            )}
          </div>
          {filterPanel("desktop")}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${noun}s…`}
              className="h-10 pl-9"
              aria-label="Search"
            />
          </div>
          <div className="flex items-center gap-2">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-10 flex-1 lg:hidden">
                  <SlidersHorizontal className="size-4" aria-hidden /> Filters
                  {activeChips.length > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-teal text-[11px] text-white">{activeChips.length}</span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] gap-0 p-0 sm:max-w-sm">
                <SheetHeader className="border-b">
                  <SheetTitle className="font-bold text-navy">Filter {noun}s</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-5">{filterPanel("mobile")}</div>
                <div className="grid grid-cols-2 gap-2 border-t p-4">
                  <Button variant="outline" onClick={clearAll}>Clear all</Button>
                  <Button className="bg-teal text-white hover:bg-teal/90" onClick={() => setFiltersOpen(false)}>
                    Show {filtered.length}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="h-10 flex-1 sm:w-48 sm:flex-none" aria-label="Sort">
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

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="mr-1 text-sm text-muted-foreground">
            <span className="font-semibold text-navy">{filtered.length}</span> {noun}
            {filtered.length === 1 || noun.endsWith("series") ? "" : "s"}
          </p>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="inline-flex items-center gap-1 rounded-full border border-teal/30 bg-teal/5 px-2.5 py-1 text-xs font-medium text-teal hover:bg-teal/10"
            >
              {chip.label} <X className="size-3" aria-label="Remove filter" />
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed bg-card p-10 text-center sm:p-12">
            <SearchX className="mx-auto size-8 text-muted-foreground" aria-hidden />
            <p className="mt-3 font-heading text-lg font-bold text-navy">Nothing matches your filters</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a different search term or clear the filters.</p>
            <Button variant="outline" className="mt-5" onClick={clearAll}>Clear all filters</Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
