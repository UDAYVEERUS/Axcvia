"use client";

import { useMemo, useState } from "react";
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
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "popular" | "rating" | "price-asc" | "price-desc";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function sortCourses(list: Course[], sort: SortKey) {
  return list.toSorted((a, b) => {
    switch (sort) {
      case "rating":
        return b.rating - a.rating;
      case "price-asc":
        return a.discountFee - b.discountFee;
      case "price-desc":
        return b.discountFee - a.discountFee;
      default:
        return b.learners - a.learners;
    }
  });
}

export function CourseCatalog({
  courses,
  categories,
}: {
  courses: Course[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [format, setFormat] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = courses.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (format !== "all" && !c.formats.includes(format as Course["formats"][number])) return false;
      if (q && !`${c.title} ${c.category} ${c.tagline}`.toLowerCase().includes(q)) return false;
      return true;
    });
    return sortCourses(list, sort);
  }, [courses, query, category, format, sort]);

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
              placeholder="Search courses…"
              className="pl-9"
              aria-label="Search courses"
            />
          </div>
          <Tabs value={format} onValueChange={setFormat}>
            <TabsList>
              <TabsTrigger value="all">All Formats</TabsTrigger>
              <TabsTrigger value="live-online">Live Online</TabsTrigger>
              <TabsTrigger value="self-paced">Self-Paced</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-3 lg:ml-auto">
            <p className="whitespace-nowrap text-sm text-muted-foreground">
              <span className="font-semibold text-navy">{filtered.length}</span>{" "}
              course{filtered.length === 1 ? "" : "s"}
            </p>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-44" aria-label="Sort courses">
                <SelectValue placeholder="Most Popular" />
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

        <div className="mt-3 flex flex-wrap gap-2 border-t pt-3" role="group" aria-label="Filter by category">
          {["All", ...categories].map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}>
              <Badge
                variant={category === cat ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-3 py-1.5 text-sm transition-colors",
                  category === cat
                    ? "bg-navy hover:bg-navy"
                    : "hover:border-teal/50 hover:text-teal"
                )}
              >
                {cat}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed bg-card p-12 text-center">
          <SearchX className="mx-auto size-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 text-lg font-semibold text-navy">No courses match your filters</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search term or clear the category filter.
          </p>
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
